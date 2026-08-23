import { Theme } from '@/types/types';

type CookiesProps = {
  theme: Theme;
};

export const Cookies = ({ theme }: CookiesProps) => {
  const isDark = theme;

  const t = (dark: string, light: string) =>
    isDark ? dark : light;

  const cardTheme = isDark ? '': '';

  const mutedText = isDark
    ? 'text-[#C5C6C7]/70'
    : 'text-black';

  const headingText = isDark ? '': '';

  const accentText = isDark
    ? 'text-[#66FCF1]'
    : 'text-[#007AFF]';

  const sections = [
    {
      title: '1. What are cookies?',
      content: [
        'Cookies are small text files or similar identifiers stored on your device when you visit a website. They allow a website to remember information about your visit, recognize your browser, maintain certain functions, and understand how a service is used.',
        'We may also use technologies that perform functions similar to cookies, including local storage, pixels, SDKs, and other device or browser identifiers. For simplicity, this policy refers to these technologies collectively as "cookies" unless a distinction is relevant.',
      ],
    },
    {
      title: '2. Your choices in Europe',
      content: [
        'For users in the European Economic Area and other jurisdictions where consent is required, we distinguish between technologies necessary to provide a service you have requested and those that require your permission.',
        'Where required, non-essential cookies will not be activated until you provide appropriate consent. You can refuse optional cookies without losing access to core functionality, although some features may work differently depending on your choices.',
      ],
    },
    {
      title: '3. How long cookies remain',
      content: [
        'Some cookies are session cookies and are deleted when you close your browser. Others are persistent cookies that remain on your device for a defined period or until you delete them.',
        'Retention periods depend on the purpose of the technology and the service provider involved. Where applicable, specific retention periods should be disclosed in the cookie settings interface or cookie inventory.',
      ],
    },
    {
      title: '4. International users',
      content: [
        'Privacy and cookie requirements differ between countries. We aim to apply appropriate safeguards and consent mechanisms based on the jurisdiction in which the service is accessed.',
        'Certain regions may provide additional rights or impose additional requirements regarding online identifiers, targeted advertising, analytics, or similar technologies.',
      ],
    },
    {
      title: '5. Relationship with our Privacy Policy',
      content: [
        'Cookies may involve the processing of personal data or information that can be associated with a device or user. Our Privacy Policy provides additional information about how personal data is collected, used, stored, disclosed, and protected.',
        'This Cookie Policy should therefore be read together with our Privacy Policy and, where applicable, our Terms of Service.',
      ],
    },
    {
      title: '6. Changes to this policy',
      content: [
        'We may update this Cookie Policy from time to time to reflect changes to our technology, services, legal requirements, or cookie practices.',
        'When we make material changes, we will update the date shown at the beginning of this policy and, where appropriate, provide additional notice or request consent again.',
      ],
    },
  ];

  const categories = [
    ['Necessary', 'Security, authentication, sessions, and essential functionality.', 'Not normally optional'],
    ['Preferences', 'Remembering choices and improving usability.', 'Where required'],
    ['Analytics', 'Measuring usage, performance, and service improvements.', 'Consent where required'],
    ['Marketing', 'Campaign measurement and advertising-related purposes.', 'Consent where required'],
  ];

  const types = [
    {
      title: 'Strictly necessary',
      text: 'Required for authentication, security, session management, fraud prevention, and core functionality.',
      required: true,
    },
    {
      title: 'Preferences',
      text: 'Remember choices such as language, interface preferences, or other settings.',
    },
    {
      title: 'Analytics',
      text: 'Help us understand usage, identify errors, measure performance, and improve the service.',
    },
    {
      title: 'Marketing',
      text: 'Where applicable, help measure campaigns, advertising performance, or relevant communications.',
    },
  ];

  return (
    <main className={`mx-auto flex w-full max-w-5xl flex-col gap-14 py-10 sm:py-16 ${headingText}`}>

      {/* Hero */}
      <header className="max-w-4xl">
        <p className={`mb-4 text-sm font-black uppercase tracking-[0.3em] ${accentText}`}>
          Cookie Policy
        </p>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Cookies and similar technologies
        </h1>

        <p className={`mt-6 max-w-3xl text-lg leading-8 ${mutedText}`}>
          This Cookie Policy explains how cookies and similar technologies
          are used when you visit or interact with our website and services.
          It also explains the choices available to you and how you can
          change or withdraw your preferences.
        </p>

        <div className={`mt-8 rounded-2xl border px-6 py-5 text-sm ${cardTheme}`}>
          <strong>Last updated:</strong> 12 August 2026
        </div>
      </header>


      {/* Cookie Types */}
      <section className="space-y-8" aria-labelledby="cookie-use">
        <div>
          <h2 id="cookie-use" className="text-3xl font-black sm:text-4xl">
            How we use cookies
          </h2>

          <p className={`mt-4 leading-8 ${mutedText}`}>
            Depending on the features you use and the choices you make,
            cookies may be used for the following purposes:
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {types.map((item) => (
            <article key={item.title} className={`rounded-3xl border p-7 ${cardTheme}`}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-black">{item.title}</h3>

                {item.required && (
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${t(
                    'bg-[#66FCF1]/10 text-[#66FCF1]',
                    'bg-[#007AFF]/10 text-[#007AFF]'
                  )}`}>
                    Required
                  </span>
                )}
              </div>

              <p className={`mt-4 text-sm leading-7 ${mutedText}`}>
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>


      {/* Cookie Categories */}
      <section className="space-y-8" aria-labelledby="categories">
        <div>
          <h2 id="categories" className="text-3xl font-black sm:text-4xl">
            Cookie categories
          </h2>

          <p className={`mt-4 leading-8 ${mutedText}`}>
            Not all cookies serve the same purpose. The categories below
            describe the main types of technologies that may be used.
          </p>
        </div>

        <div className={`overflow-hidden rounded-3xl border ${cardTheme}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className={t('bg-white/10', 'bg-black/[0.04]')}>
                <tr>
                  <th className="px-6 py-5 font-black">Category</th>
                  <th className="px-6 py-5 font-black">Purpose</th>
                  <th className="px-6 py-5 font-black">Consent</th>
                </tr>
              </thead>

              <tbody>
                {categories.map(([name, purpose, consent]) => (
                  <tr
                    key={name}
                    className={t(
                      'border-t border-white/10',
                      'border-t border-black/10'
                    )}
                  >
                    <td className="px-6 py-5 font-bold">{name}</td>
                    <td className={`px-6 py-5 ${mutedText}`}>{purpose}</td>
                    <td className="px-6 py-5 font-bold">{consent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* General Sections */}
      {sections.map((section) => (
        <section key={section.title} className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            {section.title}
          </h2>

          {section.content.map((paragraph) => (
            <p key={paragraph} className={`leading-8 ${mutedText}`}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}


      {/* Third Parties */}
      <section className="space-y-6" aria-labelledby="third-parties">
        <h2 id="third-parties" className="text-3xl font-black sm:text-4xl">
          Third-party technologies
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          Some functionality may rely on services provided by third parties.
          These providers may place their own cookies or use similar
          technologies when their services are loaded or used.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          Third-party technologies may include authentication providers,
          analytics services, payment providers, embedded content,
          infrastructure providers, or other services required to provide
          specific functionality.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          Where third-party technologies are optional, they should only be
          activated in accordance with your applicable consent choices.
          Third parties may process information under their own privacy
          policies and terms.
        </p>
      </section>


      {/* Managing Preferences */}
      <section className="space-y-6" aria-labelledby="preferences">
        <h2 id="preferences" className="text-3xl font-black sm:text-4xl">
          Managing your cookie preferences
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          You can manage optional cookie preferences through the cookie
          settings mechanism provided on the website, where available.
          If you previously gave consent, you should be able to change
          or withdraw that consent at any time.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          You can also control cookies through your browser settings.
          Most browsers allow you to block, delete, or restrict cookies.
          Blocking necessary cookies may affect authentication, security,
          or other essential functions.
        </p>

        <div className={`rounded-3xl border p-7 ${cardTheme}`}>
          <h3 className="text-xl font-black">
            Withdrawing consent
          </h3>

          <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
            If you withdraw consent for optional technologies, this will
            not affect the lawfulness of processing that took place before
            your withdrawal. Some technologies may remain active until the
            relevant session ends or stored data is removed.
          </p>
        </div>
      </section>


      {/* Contact */}
      <section
        className={`rounded-[2.5rem] border p-8 sm:p-10 ${cardTheme}`}
        aria-labelledby="contact"
      >
        <h2 id="contact" className="text-3xl font-black sm:text-4xl">
          Contact
        </h2>

        <p className={`mt-4 max-w-3xl leading-8 ${mutedText}`}>
          If you have questions about this Cookie Policy, our use of
          cookies, or your privacy choices, please contact us through
          the official contact channel provided on the website.
        </p>
      </section>


      {/* Footer */}
      <footer
        className={`
          border-t pt-8 text-sm leading-7
          ${t(
            'border-white/10 text-[#C5C6C7]/60',
            'border-black/10 text-[#1F2833]/60'
          )}
        `}
      >
        This policy is intended to provide general information about
        cookies and similar technologies. Applicable legal requirements
        may vary depending on your location, the technologies used,
        and the specific services provided.
      </footer>

    </main>
  );
};