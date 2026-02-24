import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Send, User, Reply } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QAReply {
  id: string;
  authorName: string;
  text: string;
  timestamp: Date;
}

interface QAItem {
  id: string;
  authorName: string;
  question: string;
  timestamp: Date;
  replies: QAReply[];
}

const sampleData: QAItem[] = [
  {
    id: 'qa-1',
    authorName: 'Priya S.',
    question: 'Can someone explain the difference between the approaches discussed in this lesson? I found the second method more intuitive but want to make sure I understand the trade-offs.',
    timestamp: new Date(Date.now() - 86400000 * 2),
    replies: [
      { id: 'r-1', authorName: 'Instructor', text: 'Great question! The first approach is more performant for large datasets, while the second is easier to maintain. Choose based on your use case.', timestamp: new Date(Date.now() - 86400000) },
    ],
  },
  {
    id: 'qa-2',
    authorName: 'Arjun K.',
    question: 'Is there any additional reading material recommended for this topic?',
    timestamp: new Date(Date.now() - 86400000 * 5),
    replies: [],
  },
];

export const LessonQA = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<QAItem[]>(sampleData);
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !question.trim()) return;
    setItems(prev => [{
      id: `qa-${Date.now()}`,
      authorName: name.trim(),
      question: question.trim(),
      timestamp: new Date(),
      replies: [],
    }, ...prev]);
    setQuestion('');
  };

  const handleReply = (qaId: string) => {
    if (!replyText.trim() || !name.trim()) return;
    setItems(prev => prev.map(q =>
      q.id === qaId
        ? { ...q, replies: [...q.replies, { id: `r-${Date.now()}`, authorName: name.trim(), text: replyText.trim(), timestamp: new Date() }] }
        : q
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  const timeAgo = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="mt-8 rounded-xl border border-border/50 bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-base font-semibold text-foreground">Questions & Answers</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{items.length}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4 space-y-5 animate-fade-in">
          {/* Ask form */}
          <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border/50 bg-secondary/30 p-4">
            <h4 className="text-sm font-semibold text-foreground">Ask a Question</h4>
            <Input
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-9 text-sm"
            />
            <Textarea
              placeholder="Type your question here…"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="min-h-[70px] text-sm"
            />
            <button
              type="submit"
              disabled={!name.trim() || !question.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />Post Question
            </button>
          </form>

          {/* Q&A list */}
          <div className="space-y-4">
            {items.map(q => (
              <div key={q.id} className="rounded-lg border border-border/30 bg-background p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{q.authorName}</span>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(q.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{q.question}</p>

                    {/* Replies */}
                    {q.replies.length > 0 && (
                      <div className="mt-3 space-y-2 border-l-2 border-primary/20 pl-3">
                        {q.replies.map(r => (
                          <div key={r.id} className="text-sm">
                            <span className="font-medium text-foreground">{r.authorName}</span>
                            <span className="mx-1 text-[10px] text-muted-foreground">{timeAgo(r.timestamp)}</span>
                            <p className="mt-0.5 text-foreground/80">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingTo === q.id ? (
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="Write a reply…"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          className="h-8 text-xs flex-1"
                          onKeyDown={e => e.key === 'Enter' && handleReply(q.id)}
                        />
                        <button
                          onClick={() => handleReply(q.id)}
                          disabled={!replyText.trim()}
                          className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
                        >
                          Reply
                        </button>
                        <button onClick={() => setReplyingTo(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(q.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Reply className="h-3 w-3" />Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
