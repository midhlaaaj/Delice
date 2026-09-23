import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";

export const metadata = {
  title: "Privacy Policy — Delice",
  description: "How Delice collects, uses, and protects information on this website.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "22 September 2026";
const CONTACT_EMAIL = "partner@delicedesserts.com";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={UPDATED}>
      <p>
        Delice (&quot;Delice&quot;, &quot;we&quot;, &quot;us&quot;) operates this website to showcase our
        products, journal, and the stores that carry Delice. This page explains what information we
        collect from visitors, why, and how it&apos;s handled.
      </p>

      <LegalSection title="What we collect">
        <p>
          Browsing this site (products, stores, videos, journal) does not require an account, and we
          don&apos;t ask visitors for personal information to view it. The following is collected
          automatically or only in specific, limited cases:
        </p>
        <LegalList
          items={[
            <>
              <strong>Standard server logs</strong> — like most websites, our hosting and security
              infrastructure logs request metadata (IP address, timestamps, requested URLs, user agent)
              for operating the site, diagnosing issues, and abuse/rate-limit prevention. These logs are
              not used for advertising or profiling.
            </>,
            <>
              <strong>Contact requests</strong> — if you email us (for example, about a wholesale
              partnership), we receive whatever you choose to include in that email so we can respond.
            </>,
            <>
              <strong>Admin/staff accounts</strong> — Delice team members who manage this site sign in
              through a separate admin panel using an email and password. That authentication is
              covered further in our{" "}
              <a href="/cookie-policy" className="text-ac-primary underline underline-offset-2">
                Cookie Policy
              </a>
              .
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="What we don't do">
        <LegalList
          items={[
            "We don't run advertising trackers, marketing pixels, or third-party analytics scripts on this site.",
            "We don't sell, rent, or trade any information collected here.",
            "We don't require public visitors to create an account or submit personal data to browse the site.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Store listings">
        <p>
          Store names, addresses, and map locations shown on this site are business information about
          our retail partners, published so customers can find where to buy Delice. If you represent a
          store and would like a listing corrected or removed, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ac-primary underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We apply reasonable technical safeguards to this site and its admin systems, including access
          controls on our admin panel, rate limiting to slow automated abuse, and encrypted connections
          (HTTPS). No online system is perfectly secure, but we take reasonable steps to protect the
          data we do hold.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          If you&apos;d like to know what information we hold about you, or want something corrected or
          deleted (for example, a store listing or an email you sent us), contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ac-primary underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll respond as soon as we can.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy as the site changes — for example, if we introduce online ordering
          or analytics in the future. We&apos;ll update the date at the top of this page when we do.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ac-primary underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
