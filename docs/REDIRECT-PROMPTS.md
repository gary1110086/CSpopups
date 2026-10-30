# Verification, player and bonus prompts

The corn1 release adds four reference-driven teaching formats to Browse: `robot`, `player-error`, `bonus` and `captcha`. Their illustration, gift and check graphics are local SVGs. The checkbox is a local animation, not a Google reCAPTCHA integration; the player error does not install Flash or another player. Genuine closes and Decline dismiss their own card. Escape retains the existing five-second quiet period.

## Participant flow

The checkbox starts empty. Clicking it, or pressing Space/Enter while focused, shows a spinner for 1,150ms and then a green check. Continue has no href until the check completes. Leaving, closing or destroying the card cancels the animation. A cached restore rebuilds an empty local check.

A promotional CTA synchronously opens an isolated native tab. Its initial document is `redirect-hop.html?step=1&target=trip|shop|games`. After700ms it replaces itself with step2; after850ms step2 replaces itself with a fixed homepage. There are exactly two application-controlled redirects. The final website may perform its own navigation. There is no endless chain, and a missing/unknown/duplicate step or target stops on a local error page. No arbitrary URL parameter is accepted.

The fixed destinations, checked on30 October2026, are [Trip.com](https://www.trip.com/) for travel, [IKEA Malaysia](https://www.ikea.com/my/en/) for shopping and [Steam](https://store.steampowered.com/) for games. These sites do not supply or endorse the preceding teaching prompts. The tab does not receive task/seed/round parameters; the hop document has a no-referrer policy and clears opener. No credentials, payments, permissions or installations are requested by the prompt.

When popup opening is blocked, the original card remains and exposes a genuine native link. Modifier-key actions retain native browser behaviour. The original task workspace remains in its own document; an activity round retains its absolute60-second deadline. Clean rounds never initialize these prompts.

## Staff inspection

Start any of these URLs without a seed to create a fresh inspection session. The selected format is the first floating arrival after3 active focused seconds. Ordinary ambient advertisements remain present.

- [Robot illustration](https://gary1110086.github.io/CSpopups/browse/tools.html?prompt=robot&landing=trip&lang=en&v=corn1a)
- [Player error](https://gary1110086.github.io/CSpopups/browse/tools.html?prompt=player-error&landing=shop&lang=en&v=corn1a)
- [Bonus balance](https://gary1110086.github.io/CSpopups/browse/tools.html?prompt=bonus&landing=games&lang=en&v=corn1a)
- [Animated checkbox](https://gary1110086.github.io/CSpopups/browse/tools.html?prompt=captcha&landing=trip&lang=en&v=corn1a)

Normal arrival order is bounce, robot, dodge, player-error, bonus, captcha, tiny, drawer, panel, newsletter. Only one modal can exist at a time; a conflicting modal slot falls back to a moving card. Existing density, close styles, ten-second visible-close rescue, evasion budgets, audio and one-time manual burst remain. A pending prompt retains its fixed landing category through reload/native navigation.

## Persistence and review

`br-run-v9:<seed>` imports v8 only when v9 is absent, then falls back through older absent-only versions. A corrupt present v9 does not revive legacy cards. Suspended writers and two-animation-frame BFCache reconciliation remain in place. Prompt controllers participate in suspension, removal, round expiry and destruction.

Review events retain the four formats and a strictly enumerated intended landing category. The facilitator sees the prompt name and intended destination, plus a discussion of why a checkmark animation and a normal final website do not establish that the original prompt was trustworthy. The record confirms a native-tab request, rather than activity on the third-party website.
