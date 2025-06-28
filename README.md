
## 🧾 About the App

The **Fintech Treasury App** is a responsive, real-time dashboard for managing multiple financial accounts, tracking transactions, and scheduling transfers. Built with Angular 19, NGXS, and Firebase Realtime Database, it offers instant and future fund transfers, exportable transaction history, and smooth performance across all devices. Data is also persisted in Firebase Real-Time database for better convenience, especially with features like future transfers. With features like overdue transfer highlighting, quick action cards, and live data updates, it’s designed for individuals or teams needing clear financial oversight and scheduling control. Whether viewing balances, managing accounts, or exporting data, the app simplifies treasury operations with a modern, intuitive interface and efficient state-driven architecture.


## Live URL
https://685facb687e4de54e11bcc45--loquacious-donut-755a96.netlify.app/

## 🔑 Key Accomplishments

- **Accounts Management**  
  View, add, and organize multiple financial accounts at a glance.

- **Real‑Time Transactions**  
  Effortlessly see your latest transactions with automatic Firebase sync and live updates.

- **Instant & Scheduled Transfers**  
  Transfer funds immediately or schedule future transfers with our robust `SchedulerService`.

- **State Management**  
  Powered by NGXS for predictable, scalable application state.

- **Responsive Design**  
  Mobile‑first, tablet‑ready, and desktop‑optimized pages, including Dashboard, Transfer, Export, and Transactions views.

- **Firebase Integration**  
  Secure authentication, real‑time database, and hosting via Netlify.

---

## 🏗 Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| **Framework**  | Angular 19            |
| **State**      | NGXS                  |
| **Backend**    | Firebase Realtime DB  |
| **Styling**    | CSS                   |
| **Hosting**    | Netlify (CI/CD)       |
| **Scheduler**  | Custom `SchedulerService` |

---

## 🛠 Features

### 1. Dashboard Overview  
- **Summary Cards:** Total accounts, transactions, and balances by currency.  
- **Quick Actions:** One‑click navigation to Transfer or Transactions pages.  
- **Recent Transactions:** Horizontally scrollable, status‑tagged, color‑coded entries.

### 2. Transfer Funds  
- **Immediate Transfer:** Fill out recipient, amount, and currency — submit instantly.  
- **Future Transfer:** Pick a future date; our scheduler queues and executes it on time.  
- **UX Enhancements:** Inline validations, loading spinners, and preview blocks.

### 3. Future Transfers  
- **List View:** See all pending future transfers with statuses.  
- **Overdue Highlight:** Pending transfers past their scheduled date are flagged in yellow.  
- **Actions:** Edit, cancel, or execute manually if needed.

### 4. Transactions List  
- **Full History:** Filter by date, account, or status.  
- **Responsive Table:** Auto‑scroll wrapper on mobile; adaptive font and padding.

### 5. Export Data  
- **CSV/Excel Export:** Download your transaction history in the format of your choice.

---

## 🔧 Setup & Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/alfred32-dev/fintech-treasury-app/
   cd fintech-treasury-app


2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update Environment Variables**
   Create a local `.env` or configure Netlify environment variables for your Firebase project:

   ```env
   FIREBASE_API_KEY=...
   FIREBASE_AUTH_DOMAIN=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_DATABASE_URL=...
   FIREBASE_STORAGE_BUCKET=...
   FIREBASE_MESSAGING_SENDER_ID=...
   FIREBASE_APP_ID=...
   ```

4. **Run Locally**

   ```bash
   ng serve
   ```

## 📱 Responsive Design

Every page adapts seamlessly across screen sizes:

* **Breakpoints:** 768 px, 600 px, and 480 px
* **Layouts:** CSS Grid + Flexbox for fluid cards and forms
* **Tables:** Scrollable wrappers on mobile
* **Buttons & Modals:** Stack and scale for easy tapping

---

## 📫 Get in Touch

Have questions, feedback, or ideas?

---

## ⭐ Contribute

Love what you see?

1. ⭐ Star the repo
2. 🐛 Report issues


---




