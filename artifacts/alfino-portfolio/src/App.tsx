import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { profile, projects, technologies, translations, type Language } from './content';

function normalizeExternalUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
}

function Home() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('alfino-language') === 'en' ? 'en' : 'id';
    } catch {
      return 'id';
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('alfino-language', language);
    } catch {
      // Language switching remains available when storage is disabled.
    }
  }, [language]);

  useEffect(() => {
    if (!activeProject) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProject(null);
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus();
    };
  }, [activeProject]);

  const contactLinks = [
    { label: t.contact.emailLabel, value: profile.contact.email, href: profile.contact.email ? `mailto:${profile.contact.email}` : '' },
    { label: t.contact.githubLabel, value: profile.contact.github, href: normalizeExternalUrl(profile.contact.github) },
    { label: t.contact.linkedinLabel, value: profile.contact.linkedin, href: normalizeExternalUrl(profile.contact.linkedin) },
  ];
  const socialLinks = [
    { label: 'GitHub', href: normalizeExternalUrl(profile.contact.github) },
    { label: 'LinkedIn', href: normalizeExternalUrl(profile.contact.linkedin) },
    { label: 'Instagram', href: normalizeExternalUrl(profile.contact.instagram) },
  ].filter((social) => Boolean(social.href));

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="site-shell">
      <header className="topbar" data-testid="site-header">
        <a className="wordmark" href="#top" aria-label={`${profile.name} — ${language === 'id' ? 'beranda' : 'home'}`} data-testid="link-home">ALFINO NICOLAS</a>
        <div className="nav-right">
          <nav className="nav-links" aria-label={language === 'id' ? 'Navigasi utama' : 'Main navigation'}>
            <a href="#about" data-testid="link-nav-about">{t.nav.about}</a>
            <a href="#projects" data-testid="link-nav-projects">{t.nav.projects}</a>
            <a href="#contact" data-testid="link-nav-contact">{t.nav.contact}</a>
          </nav>
          <div className="language" aria-label={language === 'id' ? 'Pilih bahasa' : 'Choose language'} data-testid="language-switch">
            <button type="button" aria-pressed={language === 'id'} onClick={() => setLanguage('id')} data-testid="button-language-id">ID</button>
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')} data-testid="button-language-en">EN</button>
          </div>
          <button className="mobile-toggle" type="button" aria-label={mobileOpen ? t.nav.closeMenu : t.nav.menu} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu">
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
        {mobileOpen && (
          <nav id="mobile-navigation" className="mobile-menu" aria-label={language === 'id' ? 'Navigasi seluler' : 'Mobile navigation'} data-testid="mobile-navigation">
            <a href="#about" onClick={closeMobileMenu} data-testid="link-mobile-about">{t.nav.about}</a>
            <a href="#projects" onClick={closeMobileMenu} data-testid="link-mobile-projects">{t.nav.projects}</a>
            <a href="#contact" onClick={closeMobileMenu} data-testid="link-mobile-contact">{t.nav.contact}</a>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero wrap" aria-labelledby="hero-title" data-testid="section-hero">
          <div className="hero-copy">
            <div className="eyebrow" data-testid="text-hero-eyebrow">{t.hero.eyebrow}</div>
            <h1 id="hero-title" data-testid="text-profile-name">
              <span>{t.hero.first}</span>
              <span>{t.hero.second}</span>
              <span className="surname">{t.hero.surname}</span>
            </h1>
            <p className="hero-lead" data-testid="text-hero-headline">{t.hero.headline}</p>
            <p className="hero-support" data-testid="text-hero-description">{t.hero.description}</p>
            <div className="actions">
              <a className="button-dark" href="#projects" data-testid="link-hero-projects">
                {t.hero.projects}<ArrowRight size={14} aria-hidden="true" />
              </a>
              <a className="text-link" href="#contact" data-testid="link-hero-contact">{t.hero.contact}</a>
            </div>
          </div>
          <div className="portrait" role="img" aria-label={t.hero.imageAlt} data-testid="image-profile-placeholder">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={t.hero.imageAlt} width="640" height="780" fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            ) : (
              <>
                <span className="portrait-cross" aria-hidden="true" />
                <span className="portrait-cross horizontal" aria-hidden="true" />
                <span className="portrait-mark" aria-hidden="true">AN</span>
                <span className="portrait-index" aria-hidden="true">{t.hero.index}</span>
                <span className="portrait-label" aria-hidden="true">{t.hero.imageNote}</span>
              </>
            )}
          </div>
          <div className="hero-meta" aria-label={language === 'id' ? 'Ringkasan profil' : 'Profile summary'}>
            <span data-testid="text-hero-education">{t.hero.location}</span>
            <span data-testid="text-hero-focus">{t.hero.direction}</span>
          </div>
        </section>

        <section id="about" className="section wrap" aria-labelledby="about-title" data-testid="section-about">
          <div className="section-head">
            <div className="section-index">{t.about.index}</div>
            <h2 className="section-title" id="about-title" data-testid="text-about-title">{t.about.title}</h2>
          </div>
          <div className="about-grid">
            <p className="about-copy" data-testid="text-about-body">{t.about.body}</p>
            <div className="about-aside">
              <div className="aside-label">{t.about.skills}</div>
              <div className="skill-list" aria-label={t.about.skills} data-testid="list-technologies">
                {technologies.map((technology) => <span className="skill" key={technology} data-testid={`skill-${technology.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{technology}</span>)}
              </div>
              <div className="focus-note">
                <strong>{t.about.focusLabel}</strong>
                <span data-testid="text-current-focus">{t.about.focus}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects" aria-labelledby="projects-title" data-testid="section-projects">
          <div className="wrap">
            <div className="project-intro">
              <div>
                <div className="section-index">{t.projects.index}</div>
                <h2 className="section-title" id="projects-title" data-testid="text-projects-title">{t.projects.title}</h2>
              </div>
              <div className="project-count" data-testid="text-project-count">{t.projects.count}</div>
            </div>
            <div className="project-list">
              {projects.map((project, index) => (
                <article className="project-card" key={project.id} data-testid={`card-project-${project.id}`}>
                  {project.image ? (
                    <img className="project-art" src={project.image} alt={index === 0 ? t.projects.imageAltOne : t.projects.imageAltTwo} width="720" height="440" loading="eager" />
                  ) : (
                    <div className="project-art" role="img" aria-label={index === 0 ? t.projects.imageAltOne : t.projects.imageAltTwo} data-testid={`image-project-placeholder-${project.id}`}>
                      <span className="art-grid" aria-hidden="true" />
                      <span className="art-frame" aria-hidden="true" />
                      <div className="art-content" aria-hidden="true">
                        <div className="art-overline">{project.artwork === 'decision' ? t.projects.artDecision : t.projects.artSql}</div>
                        {project.artwork === 'decision' ? (
                          <>
                            <div className="art-word">PASKIBRA<br />SELECT</div>
                            <div className="art-bars"><i /><i /><i /><i /><i /></div>
                          </>
                        ) : (
                          <div className="sql-lines">
                            <div><span>01</span> SELECT candidate_id</div>
                            <div><span>02</span> FROM assessment</div>
                            <div><span>03</span> WHERE score IS NOT NULL;</div>
                          </div>
                        )}
                      </div>
                      <span className="project-placeholder-note" aria-hidden="true">{t.projects.imageNote}</span>
                    </div>
                  )}
                  <div className="project-info">
                    <div className="project-number">{t.projects.marker} / {project.number}</div>
                    <h3 data-testid={`text-project-title-${project.id}`}>{project.title}</h3>
                    <p data-testid={`text-project-description-${project.id}`}>{project.short[language]}</p>
                    <div className="tech-row" aria-label={t.projects.technologies}>
                      {project.technologies.map((technology) => <span className="tech-pill" key={technology}>{technology}</span>)}
                    </div>
                    <div className="project-actions">
                      <button type="button" className="detail-button" onClick={(event) => { openerRef.current = event.currentTarget; setActiveProject(project); }} aria-label={`${t.accessibility.open}: ${project.title}`} data-testid={`button-project-details-${project.id}`}>
                        {t.projects.viewDetails}<ArrowUpRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact wrap" aria-labelledby="contact-title" data-testid="section-contact">
          <div className="contact-layout">
            <div>
              <div className="section-index">{t.contact.index}</div>
              <h2 id="contact-title" className="contact-title" data-testid="text-contact-title">{t.contact.title}</h2>
              <p className="contact-copy" data-testid="text-contact-description">{t.contact.description}</p>
            </div>
            <div className="contact-right">
              {contactLinks.map((item) => (
                <div className="contact-row" key={item.label} data-testid={`contact-row-${item.label.toLowerCase()}`}>
                  <span>{item.label}</span>
                  {item.value && item.href ? (
                    <a className="contact-value" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} data-testid={`link-contact-${item.label.toLowerCase()}`}>
                      {item.label === t.contact.emailLabel ? item.value : item.href.replace(/^https?:\/\/(www\.)?/, '')}<ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  ) : <span className="contact-value" data-testid={`status-contact-${item.label.toLowerCase()}`}>{t.contact.unavailable}</span>}
                </div>
              ))}
              <div className="contact-cta">
                <small data-testid="text-contact-note">{t.contact.note}</small>
                {profile.contact.email ? (
                  <a className="button-dark" href={`mailto:${profile.contact.email}`} data-testid="link-send-email">{t.contact.send}<ArrowRight size={14} aria-hidden="true" /></a>
                ) : (
                  <button className="button-dark" type="button" disabled aria-disabled="true" title={t.contact.sendUnavailable} data-testid="button-email-unconfigured">
                    {t.contact.sendUnavailable}<ArrowRight size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" data-testid="site-footer">
        <div className="footer-inner wrap">
          <div className="footer-name" data-testid="text-footer-name">{profile.name}</div>
          <div className="footer-note">{t.footer.note}</div>
          <nav className="footer-nav" aria-label={language === 'id' ? 'Navigasi footer' : 'Footer navigation'}>
            <a href="#about" data-testid="link-footer-about">{t.nav.about}</a><a href="#projects" data-testid="link-footer-projects">{t.nav.projects}</a><a href="#contact" data-testid="link-footer-contact">{t.nav.contact}</a>
            {socialLinks.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} profile`} data-testid={`link-footer-${social.label.toLowerCase()}`}>{social.label}<ArrowUpRight size={10} aria-hidden="true" /></a>)}
          </nav>
          <div className="copyright" data-testid="text-copyright">© {new Date().getFullYear()} {t.footer.copyright}</div>
        </div>
      </footer>

      {activeProject && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }} data-testid="project-dialog-backdrop">
          <section ref={dialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" data-testid="dialog-project-details">
            <button ref={closeButtonRef} type="button" className="dialog-close" onClick={() => setActiveProject(null)} aria-label={`${t.accessibility.close}: ${activeProject.title}`} data-testid="button-close-project-dialog"><X size={18} aria-hidden="true" /></button>
            <div className="dialog-kicker">{t.projects.marker} / {activeProject.number} · {activeProject.context[language]}</div>
            <h2 id="dialog-title">{activeProject.title}</h2>
            <p id="dialog-description">{activeProject.details[language]}</p>
            {activeProject.screenshots.length > 0 && (
              <div className="project-gallery">
                <h3 className="dialog-subhead">{t.projects.screenshots}</h3>
                {activeProject.screenshots.map((screenshot) => (
                  <figure className="project-screenshot" key={screenshot.src}>
                    <img src={screenshot.src} alt={screenshot.alt[language]} loading="lazy" />
                    <figcaption>{screenshot.caption[language]}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <h3 className="dialog-subhead">{t.projects.features}</h3>
            <ul className="detail-list">
              {activeProject.features[language].map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <h3 className="dialog-subhead">{t.projects.technologies}</h3>
            <div className="tech-row">
              {activeProject.technologies.map((technology) => <span className="tech-pill" key={technology}>{technology}</span>)}
            </div>
            <div className="dialog-foot">{t.projects.imageNote}</div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
