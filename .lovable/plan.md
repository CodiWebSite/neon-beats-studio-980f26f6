# DJ Funky — Management & Booking

Păstrăm designul actual (fonturi, culori, butoane, animații). Adăugăm doar zonele de management.

## Ce se adaugă
1. **Pagina nouă /management** — profil Izabela Stoica, Artist Manager — DJ Funky: textul de prezentare, cele 9 responsabilități afișate ca listă premium (nu card de „echipă”), contact (email, telefon clicabil, website), butoane CONTACT MANAGEMENT (mailto) și WHATSAPP (wa.me/40769291604). Fluxul vizual Artist → Management → Booking → Events → Collaborations.
2. **Homepage** — bloc „BOOK DJ FUNKY” înainte de Contact, cu textul cerut, datele managerului și butonul CONTACT MANAGEMENT (duce la /management).
3. **Contact** — card „DJ FUNKY MANAGEMENT” cu Izabela Stoica, email, telefon, lista celor 8 tipuri de solicitări și butonul BOOK DJ FUNKY (duce la formular).
4. **Formular booking** — păstrat; câmpuri noi: Companie, Locație, Nr. invitați, Buget; lista nouă de tipuri de eveniment (Nuntă … Altul). Sub formular: „Solicitarea va fi preluată de managementul oficial DJ Funky.” + email.
5. **Footer** — zonă nouă DJ FUNKY (DJ • Producer • Remixer, Afro House • House • Balkan, Romanian Vibes Worldwide) + OFFICIAL MANAGEMENT; toate linkurile existente rămân, se adaugă linkurile Radio și Management.
6. **Meniu** — link „Management” în meniu (desktop + mobil).
7. **SEO** — titlu, descriere și cuvinte-cheie cerute pe /management; pagina adăugată în sitemap și llms.txt.
8. **Admin** — cererile de ofertă afișează și câmpurile noi.

Izabela apare doar ca Artist Manager / Official Management, fără CEO/Label.

## Detalii tehnice
- Migrare: coloane noi în `contact_requests` (company, location, guests, budget), nullable.
- Componentă nouă `ManagementSection` refolosită pe /management (varianta completă) și pe homepage (varianta compactă); rută `/management` în App.tsx cu `SEO`.
- Linkurile din meniu cu `#` funcționează și de pe /management (navighează la `/#secțiune`).
- Verificare Playwright pe desktop/tabletă/mobil, trimitere formular, linkuri mailto/tel/WhatsApp.
