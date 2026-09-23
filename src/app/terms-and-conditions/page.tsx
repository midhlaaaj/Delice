import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";

export const metadata = {
  title: "Terms & Conditions — Delice",
  description: "The terms that apply to using the Delice website.",
  alternates: { canonical: "/terms-and-conditions" },
};

const UPDATED = "22 September 2026";
const CONTACT_EMAIL = "partner@delicedesserts.com";

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated={UPDATED}>
      <p>
        These terms apply to your use of the Delice website. By browsing this site, you agree to them.
        If you don&apos;t agree, please don&apos;t use the site.
      </p>

      <LegalSection title="What this site is">
        <p>
          This website is informational — it showcases Delice products, our journal, video content, and
          a directory of stores that carry Delice. It does not process online orders or payments; to buy
          Delice, visit one of the stores listed on the{" "}
          <a href="/stores" className="text-ac-primary underline underline-offset-2">
            Find a Store
          </a>{" "}
          page.
        </p>
      </LegalSection>

      <LegalSection title="Accuracy of information">
        <LegalList
          items={[
            "Product descriptions, prices, and images are for reference. Actual products, pricing, and availability at any given store may vary and are set by that store.",
            "Store listings (name, address, hours, map location) are provided in good faith but may occasionally be out of date. We recommend confirming directly with a store before visiting for a specific item.",
            "We update this site regularly but don't guarantee it is error-free at all times.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The Delice name, logo, product photography, videos, and written content on this site belong to
          Delice (or are used with permission) and are protected by applicable intellectual property
          law. You may view and share pages of this site for personal, non-commercial purposes. You may
          not reproduce, redistribute, or use our branding, photography, or written content commercially
          without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="User-generated content">
        <p>
          Some content on this site (for example, videos on the &quot;Videos&quot; page) may feature
          creators who&apos;ve posted about Delice publicly. Credit is given via the handle shown with
          each clip. If you&apos;re a creator featured here and would like your content removed, contact
          us and we&apos;ll take it down promptly.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Attempt to gain unauthorized access to any part of this site, including the admin panel or underlying systems.",
            "Use automated tools to scrape, overload, or disrupt the site.",
            "Use the site for any unlawful purpose.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Third-party links">
        <p>
          This site links to third-party destinations, such as a store&apos;s Google Maps listing or a
          creator&apos;s social media profile. We aren&apos;t responsible for the content or practices of
          those third-party sites.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          This site and its content are provided &quot;as is,&quot; without warranties of any kind, to
          the fullest extent permitted by law. Delice is not liable for any indirect or consequential
          loss arising from your use of this site.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the site after a change means
          you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>These terms are governed by the laws of India.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-ac-primary underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
