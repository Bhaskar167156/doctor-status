# Doctor Home-Visit Status

A tiny website with two pages:

- **`index.html`** — public page patients open to see if the doctor is
  *Available at home*, *Busy*, or *Out of station*, updated live.
- **`admin.html`** — a sign-in-protected page the doctor or staff use to
  change that status from a phone or computer.

No server to run. It's a static site (works on GitHub Pages, free) plus
Firebase (free tier) as the tiny backend that stores the current status and
pushes it to everyone's screen instantly.

## How it works

- Firebase **Firestore** stores one document: the current status, an
  optional note, and a timestamp.
- The public page subscribes to that document in real time — no refresh
  button needed.
- Firebase **Authentication** guards the admin page with a single
  email/password login for the doctor or a staff member.
- Everything runs in the browser; there's no backend code to host.

## Cost

Firebase's free "Spark" plan comfortably covers this: one document read per
page view and a handful of writes a day is far below the free daily quota.
GitHub Pages is free for public repos. Total expected cost: **$0/month**
for a single-doctor site.

## One-time setup

### 1. Create a Firebase project

1. Go to <https://console.firebase.google.com/> and click **Add project**.
2. Give it any name (e.g. `dr-status`) and finish the wizard. You can skip
   Google Analytics.

### 2. Add a Web App and get your config

1. In the project overview, click the **`</>`** (Web) icon to register a
   new web app. Any nickname is fine.
2. Firebase shows a `firebaseConfig` object. Copy it.
3. Open `js/config.js` in this project and paste your values into the
   `firebaseConfig` export, replacing the placeholders.

### 3. Turn on Firestore

1. In the Firebase console, open **Build > Firestore Database** and click
   **Create database**. Choose *Start in production mode* and pick a
   region close to your patients.
2. Once created, go to the **Rules** tab and replace the contents with the
   `firestore.rules` file included in this project, then click **Publish**.
3. Go to the **Data** tab and manually add the starting document (the
   admin page can update it after this, but it needs to exist once):
   - Collection ID: `status`
   - Document ID: `current`
   - Fields: `status` (string) = `away`, `note` (string) = `` (empty),
     `updatedAt` — you can leave this off; the admin page will set it on
     first save.

### 4. Turn on sign-in for the admin page

The admin page uses a **plain username + password** — staff never need a
personal email address. Under the hood, Firebase's password login still
technically requires something shaped like an email, so the code quietly
turns a username like `rambabu` into `rambabu@doctor-status.local` before
sending it to Firebase. Nothing is ever sent to that address — it's just
an internal ID, not a real inbox. This is handled automatically by
`js/admin.js` and `USERNAME_DOMAIN` in `js/config.js`; you don't need to
change anything for it to work.

1. Open **Build > Authentication > Sign-in method** and enable
   **Email/Password**.
2. Go to the **Users** tab and click **Add user**.
3. In Firebase's "Add user" dialog, the field is still labeled "Email" —
   type the username followed by `@doctor-status.local`, e.g.
   `rambabu@doctor-status.local`. Set a password.
4. On the actual admin page (`admin.html`), staff will just type
   `rambabu` as the username — they never see or need to type the
   `@doctor-status.local` part.
5. You can add more staff accounts the same way later, each with their
   own username and password.

### 5. Personalize the page

Open `js/config.js` and edit the `doctorInfo` section: name, specialty,
and the short footer line (address, phone number, visiting hours — kept
short on purpose so the page stays simple to scan).

## Hosting it for free

Any of these work well; GitHub Pages is the simplest if you're already
using GitHub.

### Option A — GitHub Pages (free, static hosting)

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a
   branch`, pick your default branch and the `/ (root)` folder, then save.
4. GitHub gives you a URL like `https://yourname.github.io/repo-name/`.
   That's the link to share with patients (it opens `index.html`
   automatically). The admin page is at `.../admin.html`.

### Option B — Netlify or Vercel (also free)

Both offer a free tier for static sites: connect the GitHub repo, leave
the build command empty (there isn't one — it's plain HTML/CSS/JS), and
set the publish directory to the repo root. Either gives you a free
`*.netlify.app` or `*.vercel.app` URL, and you can later attach your own
domain.

## Using it day to day

- Doctor/staff visits `admin.html`, signs in, taps the current status,
  optionally adds a short note (e.g. "Back by 6 PM"), and taps **Save
  status**.
- Anyone with the site link sees the update within a second or two on
  `index.html`, with a "Updated x minutes ago" timestamp.

## Adding more staff or a custom domain

- **More staff logins:** add more users under Authentication > Users in
  the Firebase console — no code changes needed.
- **Custom domain** (e.g. `status.drname.com`): GitHub Pages, Netlify, and
  Vercel all support attaching a custom domain for free; you only pay your
  domain registrar for the domain name itself.

## Project structure

```
doctor-status-app/
├── index.html          # public status page
├── admin.html          # staff sign-in + status update page
├── css/
│   └── style.css
├── js/
│   ├── config.js        # <- edit this with your Firebase keys & doctor info
│   ├── app.js            # public page logic
│   └── admin.js           # admin page logic
├── firestore.rules      # security rules to paste into Firebase console
└── README.md
```
