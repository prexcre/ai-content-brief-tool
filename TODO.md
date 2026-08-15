## Known issues / backlog

- [ ] Handle first messages with insufficient info (Option B: instruct Gemini to ask clarifying questions instead of forcing schema when there's not enough detail)
- [Done] Add placeholder text to textarea
Add rate limitng middleware before shipping to prevent backend crashes and quota burning. 


## v1.1 (post-MVP)
- [ ] Living Canvas: two-panel layout, left = chat/control, right = growing grid of structured cards
- [ ] Requires: separate data model for "cards" vs. conversation log, backend logic to decide per-message whether a new card should be generated

## MVP (before end of August)
- [ Done] Copy/export brief button (quick win, no backend needed)
- [Done ] Supabase: accounts + persistent saved briefs
- [ ] Stripe or basic paywall
- [ ] Deployment (backend host + frontend host, env vars in production)

## Ideas for v2+ (post-MVP)
- [ ] Living Canvas: two-panel layout, structured cards on the right
- [ ] Gamified/engaging example discovery — friend's idea: showing "what works" examples in a more interactive/entertaining format (swipeable? feed-like? needs more definition) rather than plain text