import { Theme } from '@/types/types';

const PRIVACIES = [
  {
    title: 'No long-term audio storage',
    description:
      'Audio data is processed to provide voice features and is not intended to be retained longer than necessary for the requested service.',
  },
  {
    title: 'Transient AI processing',
    description:
      'Requests sent to AI services are processed to provide the requested functionality. Retention may depend on the service provider and model selected.',
  },
  {
    title: 'OpenRouter and AI providers',
    description:
      'We may use OpenRouter to route requests to third-party AI models and services. Depending on the model or provider selected, your request may be processed by the relevant AI provider.',
  },
  {
    title: 'OAuth-secured authentication',
    description:
      'Authentication may be handled through OAuth providers. We do not receive or store your OAuth provider password.',
  },
  {
    title: 'Encrypted local persistence',
    description:
      'Where information is stored locally by the application, appropriate technical measures are used to protect that information from unauthorized access.',
  },
  {
    title: 'No sale of personal data',
    description:
      'We do not sell personal information. Personal data may be disclosed to service providers only when necessary to operate, secure, maintain, or improve the service.',
  },
];

const DATA_TYPES = [
  {
    title: 'Account information',
    description:
      'Information required to create and manage your account, such as your email address, authentication identifiers, and account settings.',
  },
  {
    title: 'AI inputs and outputs',
    description:
      'Text, images, audio, files, or other content you voluntarily submit to AI-powered features, together with the resulting responses.',
  },
  {
    title: 'Technical information',
    description:
      'Information such as browser type, device information, IP address, approximate location, timestamps, and technical logs may be processed for security and service operation.',
  },
  {
    title: 'Usage information',
    description:
      'Information about how features are accessed and used may be processed to monitor performance, prevent abuse, troubleshoot problems, and improve the service.',
  },
];

export const Privacy = ({ theme }: { theme: Theme }) => {
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

  return (
    <main
      className={`
        mx-auto flex w-full max-w-5xl flex-col gap-14
        px-6 py-10 sm:py-16
        ${headingText}
      `}
    >

      {/* Hero */}
      <header className="max-w-4xl">
        <p className={`mb-4 text-sm font-black uppercase tracking-[0.3em] ${accentText}`}>
          Privacy Policy
        </p>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Privacy, data and your rights
        </h1>

        <p className={`mt-6 max-w-3xl text-lg leading-8 ${mutedText}`}>
          We believe privacy should be understandable, predictable, and
          built into the way our services operate. This policy explains
          what information we process, why we process it, and the choices
          available to you.
        </p>

        <div className={`mt-8 rounded-2xl border px-6 py-5 text-sm ${cardTheme}`}>
          <strong>Last updated:</strong> 12 August 2026
        </div>
      </header>


      {/* Privacy principles */}
      <section className="space-y-8" aria-labelledby="principles">
        <div>
          <h2 id="principles" className="text-3xl font-black sm:text-4xl">
            Our privacy principles
          </h2>

          <p className={`mt-4 leading-8 ${mutedText}`}>
            These principles describe how we approach data protection
            throughout the platform.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2">
          {PRIVACIES.map((item, index) => (
            <li
              key={item.title}
              className={`rounded-3xl border p-7 ${cardTheme}`}
            >
              <div className="flex items-start gap-4">
                <span className={`font-mono text-xs ${accentText}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="text-lg font-black">
                    {item.title}
                  </h3>

                  <p className={`mt-2 text-sm leading-7 ${mutedText}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>


      {/* Information we process */}
      <section className="space-y-8" aria-labelledby="data">
        <div>
          <h2 id="data" className="text-3xl font-black sm:text-4xl">
            1. Information we process
          </h2>

          <p className={`mt-4 leading-8 ${mutedText}`}>
            Depending on the features you use, we may process the following
            categories of information:
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {DATA_TYPES.map((item) => (
            <article
              key={item.title}
              className={`rounded-3xl border p-7 ${cardTheme}`}
            >
              <h3 className="text-xl font-black">
                {item.title}
              </h3>

              <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>


      {/* AI processing */}
      <section className="space-y-6" aria-labelledby="ai-processing">
        <h2 id="ai-processing" className="text-3xl font-black sm:text-4xl">
          2. AI processing and OpenRouter
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          Our services may use artificial intelligence providers to
          generate responses, analyze submitted content, process voice
          interactions, understand images, perform web-related tasks,
          or provide other requested functionality.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          We may use OpenRouter as an AI routing and infrastructure
          service. OpenRouter can route requests to different AI models
          and providers based on the model or service selected by us
          or made available to you.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          As a result, information you submit to an AI feature may be
          transmitted to OpenRouter and, where applicable, to the
          underlying model provider required to process your request.
          The applicable provider may have its own privacy policy,
          retention practices, and terms.
        </p>

        <div className={`rounded-3xl border p-7 ${cardTheme}`}>
          <h3 className="text-xl font-black">
            Important information about AI requests
          </h3>

          <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
            You should avoid submitting passwords, payment credentials,
            government identification numbers, or other highly sensitive
            information to AI features unless the specific feature
            explicitly requires it and appropriate safeguards are provided.
          </p>
        </div>
      </section>


      {/* Purpose */}
      <section className="space-y-6" aria-labelledby="purposes">
        <h2 id="purposes" className="text-3xl font-black sm:text-4xl">
          3. Why we process information
        </h2>

        <ul className={`space-y-3 leading-8 ${mutedText}`}>
          <li>• Provide and operate the requested services.</li>
          <li>• Authenticate accounts and maintain account security.</li>
          <li>• Process AI, voice, visual, and web-related requests.</li>
          <li>• Prevent fraud, abuse, unauthorized access, and security threats.</li>
          <li>• Diagnose technical problems and improve reliability.</li>
          <li>• Comply with applicable legal obligations.</li>
          <li>• Improve features and user experience where legally permitted.</li>
        </ul>
      </section>


      {/* Third parties */}
      <section className="space-y-6" aria-labelledby="third-parties">
        <h2 id="third-parties" className="text-3xl font-black sm:text-4xl">
          4. Service providers and third parties
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          We may rely on carefully selected third-party providers for
          hosting, authentication, infrastructure, analytics, payments,
          security, AI processing, communications, and other technical
          functions.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          These providers may process information on our behalf or,
          in the case of independent AI providers, process information
          according to their own terms and privacy policies.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          We do not sell personal information to third parties.
        </p>
      </section>


      {/* International transfers */}
      <section className="space-y-6" aria-labelledby="transfers">
        <h2 id="transfers" className="text-3xl font-black sm:text-4xl">
          5. International data transfers
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          Some service providers may process information in countries
          outside your country of residence, including countries outside
          the European Economic Area.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          Where applicable, we seek to use appropriate legal mechanisms
          and safeguards for international transfers in accordance with
          applicable data protection law.
        </p>
      </section>


      {/* Retention */}
      <section className="space-y-6" aria-labelledby="retention">
        <h2 id="retention" className="text-3xl font-black sm:text-4xl">
          6. Data retention
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          We retain information only for as long as reasonably necessary
          for the purposes described in this policy, to provide the
          requested services, maintain security, resolve disputes,
          enforce agreements, or comply with legal obligations.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          Retention periods may vary depending on the type of information,
          the service involved, and the requirements of third-party
          providers used to deliver that service.
        </p>
      </section>


      {/* Security */}
      <section className="space-y-6" aria-labelledby="security">
        <h2 id="security" className="text-3xl font-black sm:text-4xl">
          7. Security
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          We use reasonable technical and organizational measures designed
          to protect information against unauthorized access, alteration,
          disclosure, loss, or destruction.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          No internet-based service can guarantee absolute security.
          You are responsible for maintaining the security of your
          account credentials and devices.
        </p>
      </section>


      {/* Your rights */}
      <section className="space-y-6" aria-labelledby="rights">
        <h2 id="rights" className="text-3xl font-black sm:text-4xl">
          8. Your privacy rights
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          Depending on your location and applicable law, you may have
          rights relating to your personal information, including the
          right to access, correct, delete, restrict, object to, or
          request portability of certain information.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          Where processing is based on consent, you may also withdraw
          that consent. Withdrawal does not affect the lawfulness of
          processing that occurred before withdrawal.
        </p>
      </section>


      {/* Children */}
      <section className="space-y-6" aria-labelledby="children">
        <h2 id="children" className="text-3xl font-black sm:text-4xl">
          9. Children's privacy
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          The service is not intended for children where applicable law
          requires parental authorization or prohibits the processing
          of children's information without appropriate consent.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          If you believe that a child has provided personal information
          in violation of applicable requirements, please contact us so
          that we can investigate and take appropriate action.
        </p>
      </section>


      {/* Changes */}
      <section className="space-y-6" aria-labelledby="changes">
        <h2 id="changes" className="text-3xl font-black sm:text-4xl">
          10. Changes to this Privacy Policy
        </h2>

        <p className={`leading-8 ${mutedText}`}>
          We may update this policy when our services, technologies,
          processing practices, or legal obligations change.
        </p>

        <p className={`leading-8 ${mutedText}`}>
          When material changes are made, we will update the date shown
          at the beginning of this policy and provide additional notice
          where appropriate.
        </p>
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
          If you have questions about this Privacy Policy, your personal
          information, or your privacy rights, please contact us through
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
        This policy provides general information about our privacy
        practices. Your rights and the applicable requirements may
        depend on your country or region and the services you use.
      </footer>

    </main>
  );
};