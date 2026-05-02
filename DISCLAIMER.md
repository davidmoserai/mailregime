# Disclaimer

> **Read this before you use, fork, modify, deploy, or rely on m24t in any way.**

## Plain English

1. **m24t is not legal advice.** It is a developer convenience library that returns structured data based on inputs. It is not a substitute for a lawyer, a Data Protection Officer, a compliance officer, or any other professional.

2. **The data may be wrong.** It may be out of date. It may be incomplete. It may be inapplicable to your specific facts. Laws change weekly somewhere in the world. The maintainers do not promise the data is accurate, current, complete, or suitable for your use case — and explicitly disclaim any such promise.

3. **No professional relationship.** Nothing in this repository, this software, the docs, the issue tracker, the discussions, the commits, the pull requests, the code review comments, or any communication from a maintainer creates an attorney–client relationship, a fiduciary relationship, a duty of care, or any other professional relationship of any kind.

4. **Use at your own risk.** If you use m24t and your company gets fined, sued, audited, regulated, embarrassed, shamed, blocklisted, or otherwise damaged, that is **your** problem — not the maintainers'. You agreed to that the moment you installed the package, ran the code, read the docs, or otherwise touched the project.

5. **You must get your own legal advice.** Before relying on any output of m24t for an actual business decision, retain qualified counsel licensed in every jurisdiction relevant to your use case and have them sign off on (a) your specific configuration, (b) your specific consent flows, (c) your privacy notices and disclosures, (d) your data-subject-rights procedures, (e) your record-keeping, and (f) anything else they want to look at. The maintainers will never do this for you and have no obligation or capacity to.

6. **No support obligation.** Issues may go unanswered. Pull requests may be ignored. The project may be archived without notice. Versions may break. The maintainers owe you nothing.

## Things you cannot do (or rather, things that won't help you if you do)

- You cannot rely on m24t in a regulator's view as evidence that you exercised due care.
- You cannot point at m24t in litigation as the reason your consent collection was lawful.
- You cannot claim the maintainers vetted, approved, or blessed your specific deployment.
- You cannot claim a maintainer's response to your GitHub issue is legal advice. (It isn't. It cannot be. We are not your lawyers.)
- You cannot claim the `confidence: "high"` field, the `dataLastUpdated` field, the `lawyerAttestation` field, or any other field guarantees correctness or fitness for purpose. They are descriptive metadata only.

## What "lawyerAttestation" means (when present)

If a country record carries a `lawyerAttestation` object, it means: a named lawyer at a named firm reviewed that data record on a stated date in a specific jurisdiction. It does **not** mean:

- That lawyer is your lawyer.
- That lawyer represents the m24t project, the maintainers, or you.
- That lawyer has reviewed your specific use case, configuration, or business.
- That lawyer is currently maintaining the data — only that they reviewed it on the stated date.
- The data is correct as of any other date.
- The data is correct as of the stated date for your specific facts.

`lawyerAttestation` is a transparency signal, not a guarantee, not legal advice, not insurance, and not a defense.

## What `confidence` and `dataLastUpdated` mean

`confidence` is the maintainer's subjective summary of how well-tested a given country record is — a heuristic, not a warranty. `dataLastUpdated` is when a maintainer last touched the file — not when a regulator approved it, not when a court tested it, not when a lawyer reviewed it.

## Forks, modifications, and downstream redistribution

If you fork or redistribute m24t, you must keep this DISCLAIMER and the LICENSE intact. If you modify the data and republish, the original maintainers carry zero responsibility for your modifications, and you must make that clear to your downstream users.

## Jurisdiction

The LICENSE and this disclaimer do not commit any maintainer, author, or contributor to any particular jurisdiction or forum. Any dispute related to use of m24t is subject to the disclaimer of liability and waiver in the LICENSE, which the user accepted by using the software.

## In short

**This is free, open-source code provided AS-IS by volunteers. It is not a service. It is not advice. It carries no warranty. The maintainers carry no responsibility for what you do with it. If you cannot accept that, do not use it.**
