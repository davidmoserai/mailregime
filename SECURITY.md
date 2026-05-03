# Security policy

mailregime is provided AS-IS under MIT with the additional disclaimer in [LICENSE](./LICENSE) and [DISCLAIMER.md](./DISCLAIMER.md). The maintainers make no security warranty and accept no liability for security defects. By using the software you accept that.

That said: if you find a vulnerability, we'd appreciate a heads-up so we can fix it for everyone.

## Reporting

For non-critical issues, open a GitHub issue.

For issues you believe should not be public yet, use GitHub's private security advisory: <https://github.com/davidmoserai/mailregime/security/advisories/new>.

We make no commitment on response time, fix availability, or coordinated disclosure timelines. Reports are processed on a best-effort basis.

## Scope

In scope:
- Logic bugs in the core evaluator (`getEmailRules`).
- Type unsafety, prototype pollution, ReDoS in core or audit modules.
- Defects in adapters that could leak request data unintentionally.

Out of scope:
- Legal correctness of bundled data. That's a data PR with a citation, not a security report. See [CONTRIBUTING.md](CONTRIBUTING.md).
- Anything in your ESP, your app, or your deployment.
- Anything that requires the user to ignore the disclaimer.

## Reminder

Reports are not legal advice and do not create any professional relationship. The maintainers' acceptance, rejection, or silence on a report does not constitute acceptance of liability. See [DISCLAIMER.md](DISCLAIMER.md).
