-- The BackPorch: tighten table grants (applied as migration `backporch_tighten_grants`).
--
-- Supabase gives new public tables default grants to `anon` and `authenticated`,
-- which made porch_editors, porch_votes, and porch_reactions discoverable in the
-- auto-generated APIs (security advisor lints 0026/0027). RLS already blocked every
-- row, but nothing outside the database needs these tables: the editor check reads
-- porch_editors through is_porch_editor(), and votes and reactions go only through
-- the security-definer functions porch_vote/porch_react/porch_poll_results/
-- porch_reaction_counts. porch_posts keeps its deliberate grants.
revoke all on public.porch_editors from anon, authenticated;
revoke all on public.porch_votes from anon, authenticated;
revoke all on public.porch_reactions from anon, authenticated;
