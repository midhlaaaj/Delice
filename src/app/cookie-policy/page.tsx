import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";

export const metadata = {
  title: "Cookie Policy — Delice",
  description: "How Delice uses cookies on this website.",
};

const UPDATED = "22 September 2026";
const CONTACT_EMAIL = "partner@delicedesserts.com";

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" updated={UPDATED}>
      <p>
        This page explains how Delice uses cookies on this website, in plain terms.
      </p>

      <LegalSection title="The short version">
        <p>
          If you&apos;re just browsing this site — products, stores, journal, videos — we don&apos;t set
          any cookies at all. There are no advertising, analytics, or tracking cookies on this site
          today.
        </p>
      </LegalSection>

      <LegalSection title="The one cookie we do use">
        <p>
          When a Delice team member signs in to our admin panel to manage the site&apos;s content, our
          authentication system sets a single, strictly-necessary session cookie so they stay signed in
          between page loads. It:
        </p>
        <LegalList
          items={[
            "Is only ever set on sign-in to /admin — it is never set for public visitors browsing the site.",
            "Is used solely to keep an authenticated admin session active; it does not track browsing activity or identify site visitors.",
            "Is marked HttpOnly (not readable by page scripts) and is cleared on sign-out or expiry.",
          ]}
        />
        <p>
          Because this cookie is strictly necessary to provide the admin sign-in feature itself, it
          doesn&apos;t require a cookie-consent banner under most cookie laws (including GDPR&apos;s
          ePrivacy exemption for strictly necessary cookies) — it&apos;s the digital equivalent of a
          login session, not a tracking mechanism.
        </p>
      </LegalSection>

      <LegalSection title="Browser controls">
        <p>
          You can view, block, or delete cookies at any time through your browser&apos;s settings. Since
          this site doesn&apos;t use cookies for public browsing, doing so won&apos;t affect your
          experience of the public pages.
        </p>
      </LegalSection>

      <LegalSection title="If this changes">
        <p>
          If we ever add analytics, marketing tools, or other cookies to the public site, we&apos;ll
          update this page and add an appropriate consent mechanism before doing so.
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
