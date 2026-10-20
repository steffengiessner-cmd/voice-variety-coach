# Voice Variety Coach: mobile store launch plan

Prepared 20 October 2026. This is a proposed plan, not authorization to register accounts, pay fees, or publish. Store requirements should be rechecked at submission.

## Recommendation

Use Capacitor to package the existing HTML/CSS/JavaScript app as iOS and Android applications, with the interface and practice logic bundled inside each app. Keep the browser version available. Start with an offline-capable, free, account-free companion to Leading with Presence, and pilot it with workshop participants before public release.

Capacitor supports adding native iOS and Android projects to an existing web project. It allows native plugins where browser functionality is insufficient. This preserves the reading interface, colour feedback, animated audience, exercises, and scoring work already completed. It does not guarantee that browser audio APIs will behave identically in a mobile WebView. [Capacitor documentation](https://capacitorjs.com/docs), [installation workflow](https://capacitorjs.com/docs/getting-started).

Alternatives: an installable web app is a useful low-cost workshop distribution route but does not itself provide App Store and Google Play listings. React Native or Flutter would require rebuilding much of this interface; consider that only if a native prototype reveals substantial constraints. Separate Swift and Kotlin applications offer maximum platform control but would substantially increase implementation and maintenance work.

## Proposed first release

Include Story, Business, Own text, focused exercises, optional Toolbox and reflection, fullscreen recording, readable live colour feedback, optional original animated audiences, recording playback, two-take comparison, and understandable average vocal-variety feedback. Add optional local saving of recordings and reflections, a simple practice history, explicit deletion, and native sharing initiated by the user.

Default to temporary recordings unless the user chooses Save. Retain saved files in private app storage and decide explicitly whether audio is excluded from device-cloud backups. Explain what survives closing, updating, and uninstalling the app. No automatic uploads, accounts, advertising, or research collection in version one.

Do not require purchasing the book or attending training to understand the app. Explain exercises in plain language and retain accurate book references.

Defer subscriptions, cloud synchronization, instructor dashboards, automatic emotion ratings, research datasets, and cloud speech recognition. Retain automatic and manual scrolling; disable voice-follow mode in the first native build until its processing location, permissions, and device support are verified. Browser speech recognition can use a remote service; it must not be described as inherently offline. [Web Speech API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API).

## Phase 1: ownership, scope, and account preparation — week 1

Owner: Steffen, with developer support.

- Decide whether you personally or a qualifying organization will publish and own the app. Keep the developer accounts, domain, repository, signing access, and store listings under that owner's control.
- Confirm the public name; a possible working name is “Voice Variety Coach — a companion to Leading with Presence,” subject to name availability and rights.
- Confirm rights for adapted exercises, book branding, portraits, and illustrations. Review the publishing agreement and coauthor permissions; authorship does not establish every app reuse right.
- Replace recognizable superhero names/designs with original characters, unless licensed. Review any third-party prompt text and assets.
- Agree the first version is free and usable without sign-in. Decide launch countries, English-first language scope, and supported device/OS range after the prototype.
- Create the appropriate Apple Developer and Google Play accounts; complete identity and organization verification. Start this early because it can run alongside development.

Apple membership is US$99 annually, with local pricing where available. Organization enrollment requires a legal entity, authority to enroll it, and generally a D-U-N-S number; an individual enrollment uses the individual's legal name as seller. Google Play registration is US$25 once; organization enrollment has additional identity requirements. Choose the account type matching the actual publisher. [Apple enrollment](https://developer.apple.com/help/account/membership/program-enrollment), [Google registration](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en), [Google account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en).

Deliverable: approved release scope, named owner, asset/rights inventory, accounts in progress.

## Phase 2: real-device feasibility prototype — approximately 3–5 working days

Owner: developer, with Steffen testing the exercises.

Create a separate development branch and reproducible build process. Add Capacitor iOS and Android projects with bundled app assets; do not ship a shell that loads the development server or a remote website.

Install development builds on at least one real iPhone and one real Android phone. Validate microphone permissions, continuous live analysis, text scrolling, fullscreen layout, audience animations, recording, and playback. Test airplane mode, denial/re-enabling of microphone permission, calls, app switching, screen locking, and headset changes.

Define the release behavior: stop and finalize a recording on interruption/backgrounding, explain what happened on return, and never resume microphone capture silently. Keep the display awake only while recording; restore normal behavior afterward.

The current optional Praat helper uses a Mac-local address. Disable that path in mobile builds. Use the existing browser acoustic engine as the initial baseline. If WebView capture or processing is unreliable, implement a native audio adapter while retaining the interface and shared scoring logic. Avoid transporting raw high-frequency audio frames unnecessarily across the native/JavaScript bridge.

Gate: do not commit to the full launch budget until both phones can complete repeatable record → feedback → stop → playback sessions. Record actual limitations and revise the estimate. A native audio component may be needed; that does not automatically require a full app rewrite.

## Phase 3: production mobile implementation — approximately weeks 2–5

Owner: developer.

- Split the large application script into manageable recording, analysis, reader, exercises, audience, and storage components. Preserve the verified scoring behavior with focused regression checks.
- Add native lifecycle handling, safe-area layout, Android Back behavior, interruption recovery, and platform microphone permission explanations. Native apps should use an app screen layout, not rely on a browser fullscreen request.
- Implement local storage, opt-in Save, delete-one/delete-all, recording duration/storage limits, and explicit native sharing. Preserve saved sessions through app updates.
- Ensure the colour display and average score continue to use the same independent calculation. Version the scoring algorithm so comparisons remain interpretable after updates.
- Add an About/help screen, privacy link, support contact, version number, and a short recording introduction.
- Remove internal dataset-capture controls from the public build. Research collection belongs in a separate, explicitly consented workflow.
- Choose supported minimum OS versions based on the framework and tested devices. Separately satisfy the stores' current build SDK and Android target API rules; these are not the same as minimum user OS versions.

Deliverable: feature-complete signed beta builds for both platforms; core recording and practice work without a server.

## Phase 4: measurement and device validation — overlaps weeks 3–6

Owner: developer plus Steffen/coaches.

Functional testing must include small/large phones, older supported devices, portrait/landscape, iOS and Android, built-in microphones, wired/USB headsets where supported, Bluetooth, permission denial, repeated sessions, low storage, incoming calls, and app backgrounding. Use physical devices for microphone behavior; browser emulation and simulators are insufficient.

Test paired deliveries of the same passages with deliberately different pitch, energy, and pacing. Include quiet/determined delivery, deliberate pauses, and varied speaker ranges and accents. Check whether independent listener judgments broadly support the direction of the feedback. Do not optimize every exercise toward a higher number: a contextually appropriate compassionate delivery may be less varied.

Audit microphone processing such as automatic gain control, noise suppression, and echo cancellation, which can affect volume measures. Treat scores as practice indicators, not clinical measures, emotional truth, or validated leadership effectiveness. Prioritize comparisons on the same device under similar conditions; do not promise absolute comparability across phones without evidence.

Acceptance criteria: no known blocker in core flows; no continued microphone capture after Stop; no lost user-saved take in supported interruption tests; readable text throughout the colour range; no accidental audio transmission; and no unexplained device-dependent reversal of the intended feedback in the chosen validation set.

## Phase 5: privacy, store assets, and submission preparation — overlaps weeks 4–6

Owner: developer prepares; Steffen/publisher approves statements and supplies identity details.

Create a public support page and privacy policy, also linked inside the app. Inventory every SDK and actual network request. Explain microphone use, temporary and saved recordings, own text, reflections, deletion, backups, and user-initiated exports. Complete Apple's privacy answers and Google's Data safety form from the shipped build, not from intentions. On-device processing has distinct disclosure treatment; adding analytics, remote recognition, or cloud backup changes the analysis. [Apple app privacy](https://developer.apple.com/app-store/app-privacy-details/), [Google Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).

Prepare app icons, splash presentation, phone screenshots, store description, keywords/category, age/content-rating questionnaires, support/privacy URLs, copyright notices, review contact details, and reviewer instructions explaining recording and the simulated feedback. Complete applicable trader/business information for the selected markets and audit native plugin privacy manifests/required API declarations.

Apple evaluates functionality beyond a repackaged website. The recording, offline practice, saved sessions, native sharing, and deliberate mobile interaction should form a useful product, rather than a book advertisement. Approval remains Apple's decision. [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/).

Recheck build requirements immediately before submission. Use compatible supported toolchains rather than freezing this plan to a version. [Apple submission requirements](https://developer.apple.com/app-store/submitting/), [Google target API requirements](https://developer.android.com/google/play/requirements/target-sdk).

## Phase 6: participant beta — approximately weeks 6–8

Use TestFlight for iPhone and Play Console testing tracks for Android. Recruit approximately 15–25 actual workshop participants across both platforms. Give each a structured task: install unaided, grant permission, record a story, compare two takes, try a focused exercise, save/delete a recording, and practise with their own text.

Ask where they became confused, whether feedback helped, whether the audience or colour felt useful, and whether they would practise again. Collect feedback through a short voluntary form or discussion; production analytics are not necessary to answer these questions initially.

Apple's first external TestFlight build requires beta review. For Google personal developer accounts created after 13 November 2023, production access currently requires a closed test with at least 12 testers continuously opted in for at least 14 days, followed by an application for production access. Actual engagement and feedback matter; do not treat enrollment alone as the pilot. [TestFlight](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers), [Google personal-account test requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en-GB).

Gate: resolve blockers, review the actual privacy behavior, and get Steffen's sign-off on pedagogy and public wording.

## Phase 7: submission and release — approximately weeks 8–12 including buffer

Create signed iOS distribution builds and Android App Bundles, retain secure signing/recovery access, upload to the store consoles, complete the questionnaires, and submit with clear review notes. Use manual release control where available so launch happens deliberately after approval. Allow time for verification, review questions, and resubmission; approval dates cannot be guaranteed.

Launch first to the workshop community, then promote through the book/training channels once early support issues are resolved. Keep the browser app available for desktop sessions and people who prefer not to install. Provide simple links to both stores.

## Budget and continuing work

The estimate below is a planning model, not a quote or a market-rate survey. For the scope above, allow roughly 180–300 skilled implementation/testing hours, then revise after the feasibility prototype. At an illustrative €75–€125/hour, this is €13,500–€37,500, excluding VAT, devices, content/legal review, and unexpected native-audio work. Working with AI assistance can reduce some coding effort but does not remove physical-device testing, account work, content review, or ongoing ownership.

Direct store fees are US$99/year for Apple plus US$25 once for Google. Budget separately for a support domain/site, test devices if not already available, and optional build services. A local-only design does not need a paid analysis server or per-recording AI service. Reserve approximately 4–8 hours per month for support, dependency/OS checks, and small fixes, with additional time for major OS or store policy changes.

Eight to twelve calendar weeks is a reasonable initial planning window with an experienced developer, timely decisions, and access to test phones. It includes an external beta period and review buffer; it is not a promised delivery date. Native audio problems or delayed account verification extend it.

## Monetization recommendation

Release the first version free as a useful book/training companion. If sustained independent use supports paid features later, consider a one-time upgrade before a subscription; a subscription needs continuing value. Digital feature/content sales generally engage store billing rules, with market-specific exceptions and programs. Review those rules when designing payments; do not assume a book code or workshop purchase may bypass them. [Apple review/payment rules](https://developer.apple.com/app-store/review/guidelines/), [Google Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en).

## Immediate next milestone

A two-platform feasibility build, not a public launch: one real iPhone and one real Android device each successfully record, display responsive feedback, stop, and play back without the Mac helper. In parallel, settle publisher identity, content/character rights, and free-first scope. That evidence determines the final development budget and release schedule.
