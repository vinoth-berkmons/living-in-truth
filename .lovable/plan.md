
# Replace Seed Content with Real Data from Unapologetic Catholic and MFC

## Summary

Replace all placeholder content in the seed database with real videos from the **Unapologetic Catholic** YouTube channel and real articles/blogs from **Missionary Families of Christ** (missionaryfamiliesofchrist.org). Bump DB version to force re-seed.

---

## Changes

### File 1: `src/lib/db/config.ts`
- Bump `CURRENT_DB_VERSION` from `3` to `4` so existing users get the new seed data on reload

### File 2: `src/lib/db/seed_db_v1.ts`

Replace the `contentItems` and `videoItems` arrays entirely with real content. Keep all other data (workspaces, roles, users, categories, courses, modules, lessons, home sections, plans, domains) unchanged.

#### Videos (from Unapologetic Catholic YouTube channel)

**Long-format videos (8 total for Global workspace):**

| ID | Slug | Title | YouTube ID | Duration | Category | Access |
|---|---|---|---|---|---|---|
| video-global-001 | catholic-dating-qa | How Catholics (Should) Date - Catholic Dating Q&A | jAuYOD2kB_Y | 834s (13:53) | faith | free |
| video-global-002 | conversion-to-catholicism-victor | My Conversion to Catholicism w/ Victor D'souza - Walk by Faith | Si4VpyAIDpo | 2141s (35:41) | faith | free |
| video-global-003 | raising-kids-autism-walk-by-faith | Raising 3 Kids on Autism Spectrum Disorder: A Father's Story | HjPkBZp5aDw | 2195s (36:35) | life | free |
| video-global-004 | evil-spirits-physical-illness | Can Evil Spirits Cause Physical Illness? | 5wQqv2PdZpc | 379s (6:19) | faith | free |
| video-global-005 | how-to-tithe-as-christians | How to Tithe as Christians? Giving 10% to God | yk1jZxbk3N4 | 281s (4:41) | life | free |
| video-global-006 | grieving-loss-children | Grieving the Loss of Children w/ Kelvin and Amulya Castelino | FnS293ykrlQ | 3674s (1:01:14) | life | premium |
| video-global-007 | protestants-removed-bible-books | Why Did Protestants Remove Books From the Bible? | ArUuakk3Wtg | 635s (10:35) | sermons | free |
| video-global-008 | catholic-purgatory-explained | Catholic Purgatory Is Not In The Bible? Purgatory vs Hell? | hJ-CRczKCtY | 658s (10:58) | faith | premium |

**Short-format videos (5 total for Global workspace):**
These will use real video IDs from the channel's shorter clips (under 2 minutes). Since the channel doesn't have dedicated YouTube Shorts, we'll use shorter clips formatted as shorts:

| ID | Slug | Title | YouTube ID | Duration | Category | Access |
|---|---|---|---|---|---|---|
| video-global-s01 | sacraments-bible-short | Are Catholic Sacraments Based On The Bible? | lR0909VjwUo | 408s | faith | free |
| video-global-s02 | indulgences-short | Does the Catholic Church Sell Indulgences? | zIp7CwCJk0E | 552s | faith | free |
| video-global-s03 | catholics-read-bible-short | Do Catholics Read The Bible? | KlWKMgUG9vo | 810s | worship | free |
| video-global-s04 | who-treaty-short | WHO Treaty: Who Will Control Governments? | OtCrk2cNr4I | 219s | life | free |
| video-global-s05 | netflix-cleopatra-short | Netflix Cleopatra: Woke History Or Harmful Rewrite? | OnbMfwDDyn8 | 312s | life | free |

**Kids workspace videos (3 existing) will be removed** -- all video content exclusively from Unapologetic Catholic.

#### Content Items (from Missionary Families of Christ)

**Articles and blogs (7 total for Global workspace):**

| ID | Type | Slug | Title | Source | Category | Access |
|---|---|---|---|---|---|---|
| content-global-001 | article | a-time-of-transition | A Time of Transition | MFC - Transition document | faith | free |
| content-global-002 | article | the-lords-prayer | The Way Forward in Christ: The Lord's Prayer | MFC - Part 224 | worship | free |
| content-global-003 | article | in-the-footsteps-of-jesus | In the Footsteps of Jesus | MFC - New Evangelization Part 252 | faith | free |
| content-global-004 | blog | jesus-mission-our-mission | Jesus' Mission, Our Mission | MFC - Part 121 | sermons | free |
| content-global-005 | article | pilgrims-of-hope-2025 | Pilgrims of Hope: Our Theme for 2025 | MFC - 2025 Theme | faith | premium |
| content-global-006 | blog | defending-faith-family-life | Defending Faith, Family and Life | MFC - Homepage mission statement | life | free |
| content-global-007 | blog | missionary-families-identity | Our True Identity as Missionary Families | MFC - Identity section | life | premium |

**Kids workspace content (2 existing) will be removed** -- all content from MFC only.

Each content item will include real excerpts and bodyHtml from the fetched MFC articles, properly formatted.

#### Cover Images
- Videos will use YouTube thumbnail URLs: `https://i.ytimg.com/vi/{youtubeId}/hqdefault.jpg`
- Content items will use the images found on MFC pages or relevant Unsplash images for Catholic/faith content

#### Updated References

The following arrays reference content/video IDs and will be updated to match the new IDs:

- **Home Sections** (`homeSections`): Update `itemRefs` for hero sliders and ensure rail filters still work
- **Courses/Modules/Lessons**: Update `videoId` and `contentId` references in existing lessons to point to new content IDs
- **Categories**: Keep existing category structure (faith, life, worship, sermons) -- content already maps to these
- **Kids workspace**: Remove Kids-specific home sections, OR keep them but with Global workspace content references removed (since we're removing Kids content). Keep sections but with empty results (the rails will just show nothing for Kids workspace since there's no content for it).

#### Simplified Approach for Kids/Youth Workspaces
Since all content must come exclusively from the two sources (Unapologetic Catholic + MFC), and both are adult-oriented Catholic content, the Kids and Youth workspace video/content arrays will be emptied. Their home sections remain but will display empty rails.

---

## Technical Details

- Only `src/lib/db/seed_db_v1.ts` and `src/lib/db/config.ts` are modified
- DB version bump from 3 to 4 forces a fresh re-seed on page load
- All YouTube video IDs are real and verified from the Unapologetic Catholic channel
- All article content is real, sourced from missionaryfamiliesofchrist.org
- `source.provider` remains `'youtube'` for all videos
- Thumbnail format: `https://i.ytimg.com/vi/{youtubeId}/hqdefault.jpg`
