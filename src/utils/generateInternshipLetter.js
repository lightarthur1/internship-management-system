// ─────────────────────────────────────────────────────────────────────────────
//  generateInternshipLetter.js
//  Place this file at:  src/utils/generateInternshipLetter.js
//
//  Usage in StudentDashboard.jsx:
//
//    import generateInternshipLetter from "../utils/generateInternshipLetter";
//
//    // When student clicks "Download Internship Letter":
//    const handleDownload = async () => {
//      try {
//        const data = await authFetch(`/letters/${letterId}/download`);
//        generateInternshipLetter(data.letter);
//        showToast("Internship letter downloaded!");
//      } catch (err) {
//        showToast(err.message, "error");
//      }
//    };
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates and opens a printable KNUST internship letter in a new tab.
 *
 * @param {Object} letter  - The letter object returned by GET /api/letters/:id/download
 * @param {string} logoUrl - (optional) override logo path. Defaults to /src/assets/knust-logo.png
 */
const generateInternshipLetter = (letter, logoUrl) => {
  // ── Destructure all needed fields from the API response ──────────────────
  const student        = letter.student;                          // { name, email }
  const profile        = letter.studentProfile;                  // { studentId, department, level, phone, location }
  const opportunity    = letter.opportunity;                     // { companyName, location, duration }
  const supervisor     = profile?.academicSupervisor;            // { name, email }  (populated)

  // ── Derived values ────────────────────────────────────────────────────────
  const studentName    = student?.name            || "Student Name";
  const studentId      = profile?.studentId       || "—";
  const department     = profile?.department      || "—";
  const level          = profile?.level           || "—";
  const phone          = profile?.phone           || "—";
  const studentEmail   = student?.email           || "—";
  const companyName    = opportunity?.companyName || "—";
  const companyLoc     = opportunity?.location    || "—";
  const duration       = opportunity?.duration    || "—";
  const supervisorName = supervisor?.name         || "To be assigned";
  const supervisorEmail= supervisor?.email        || "—";

  // ── Reference number & date ───────────────────────────────────────────────
  const refNumber = `KNUST/${department.split(" ")[0].toUpperCase()}/INT/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`;
  const today     = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  // ── Logo path ─────────────────────────────────────────────────────────────
  // Vite serves files from /src/assets at /src/assets/...
  // For a reliable absolute path at print time, use the import or a hosted URL.
  // If you import the logo at the top of your component:
  //   import knustLogo from "../assets/knust-logo.png";
  //   generateInternshipLetter(data.letter, knustLogo);
  const logo = logoUrl || "/src/assets/knust-logo.png";

  // ── HTML Template ─────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Internship Letter — ${studentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13.5pt;
      color: #111;
      background: #fff;
      padding: 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 18mm 20mm 18mm 20mm;
      background: #fff;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      gap: 18px;
      padding-bottom: 14px;
      border-bottom: 3px double #1a5c45;
      margin-bottom: 8px;
    }
    .logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .header-text { flex: 1; text-align: center; }
    .header-text h1 {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #0d3b2e;
      margin-bottom: 3px;
    }
    .header-text p {
      font-size: 10pt;
      color: #444;
      margin: 1px 0;
    }

    .dept-bar {
      text-align: center;
      font-size: 11pt;
      font-weight: bold;
      color: #1a5c45;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 7px 0 14px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
    }

    /* ── Metadata ── */
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 11pt;
      margin-bottom: 20px;
    }

    /* ── Recipient ── */
    .recipient { font-size: 12pt; margin-bottom: 18px; line-height: 1.6; }
    .recipient strong { display: block; }

    /* ── Subject ── */
    .subject {
      font-size: 12.5pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      margin-bottom: 18px;
      line-height: 1.5;
    }

    /* ── Body ── */
    .body { font-size: 12.5pt; line-height: 1.95; }
    .body p { margin-bottom: 14px; text-align: justify; }

    /* ── Signature ── */
    .signature-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
    }
    .sig-block { font-size: 11pt; line-height: 1.6; }
    .sig-line {
      width: 200px;
      border-bottom: 1px solid #333;
      height: 45px;
      margin-bottom: 6px;
    }
    .stamp-circle {
      width: 95px;
      height: 95px;
      border: 2px dashed #aaa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10pt;
      color: #aaa;
      text-align: center;
    }

    /* ── Student details box ── */
    .details-box {
      margin-top: 36px;
      border: 1.5px solid #1a5c45;
      border-radius: 6px;
      overflow: hidden;
    }
    .details-header {
      background: #1a5c45;
      padding: 7px 16px;
      font-size: 10pt;
      font-weight: bold;
      color: #fff;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 32px;
      padding: 14px 18px;
      font-size: 11pt;
      font-family: Arial, sans-serif;
    }
    .details-grid span { color: #555; }
    .details-grid strong { color: #111; }

    /* ── Footer note ── */
    .footer-note {
      margin-top: 18px;
      font-size: 9.5pt;
      color: #666;
      text-align: center;
      font-style: italic;
      font-family: Arial, sans-serif;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }

    /* ── Print rules ── */
    @media print {
      body { padding: 0; }
      .page { width: 100%; padding: 15mm 18mm; margin: 0; box-shadow: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <!-- Print / Save button (hidden when printing) -->
  <div class="no-print" style="position:fixed; top:16px; right:16px; display:flex; gap:10px; z-index:999;">
    <button onclick="window.print()"
      style="padding:10px 22px; background:#1a5c45; color:#fff; border:none; border-radius:8px;
             font-size:14px; font-weight:bold; cursor:pointer; font-family:Arial,sans-serif;">
      ⬇ Save as PDF / Print
    </button>
    <button onclick="window.close()"
      style="padding:10px 18px; background:#f3f4f6; color:#374151; border:1px solid #e5e7eb;
             border-radius:8px; font-size:14px; cursor:pointer; font-family:Arial,sans-serif;">
      Close
    </button>
  </div>

  <div class="page">

    <!-- ── KNUST Header ── -->
    <div class="header">
      <img src="${logo}" alt="KNUST Logo" class="logo" />
      <div class="header-text">
        <h1>Kwame Nkrumah University of Science and Technology</h1>
        <p>Kumasi, Ashanti Region, Ghana</p>
        <p>Registrar: +233 3224 99897 &nbsp;|&nbsp; registrar@knust.edu.gh</p>
        <p>Admissions: +233 24 013 0946 &nbsp;|&nbsp; +233 50 048 2807</p>
      </div>
    </div>

    <div class="dept-bar">College of Science &nbsp;·&nbsp; Department of ${department}</div>

    <!-- ── Reference & Date ── -->
    <div class="meta-row">
      <span>Our Ref:&nbsp; <strong>${refNumber}</strong></span>
      <span>Date:&nbsp; <strong>${today}</strong></span>
    </div>

    <!-- ── Recipient ── -->
    <div class="recipient">
      <strong>The Manager / HR Department</strong>
      ${companyName}<br />
      ${companyLoc}
    </div>

    <!-- ── Subject ── -->
    <div class="subject">
      Letter of Introduction — Industrial Attachment / Internship:<br />
      ${studentName} &nbsp;(ID: ${studentId})
    </div>

    <!-- ── Body ── -->
    <div class="body">
      <p>Dear Sir/Madam,</p>

      <p>
        I write on behalf of the Department of <strong>${department}</strong>, Kwame Nkrumah University
        of Science and Technology (KNUST), Kumasi, to introduce <strong>${studentName}</strong>, a
        <strong>${level}</strong> student pursuing a degree in <strong>${department}</strong>
        at this institution.
      </p>

      <p>
        As part of the academic requirements for the award of his/her degree, ${studentName.split(" ")[0]} is required
        to undergo a mandatory Industrial Attachment / Internship programme. We respectfully request
        that your esteemed organisation provide him/her with a placement for a period of
        <strong>${duration}</strong>.
      </p>

      <p>
        During the attachment period, ${studentName.split(" ")[0]} will be under the academic supervision of
        <strong>${supervisorName}</strong> of this department, who may be reached at
        <strong>${supervisorEmail}</strong>. A supervisor from your organisation will also be required
        to submit a performance evaluation report at the end of the placement.
      </p>

      <p>
        We are confident that ${studentName.split(" ")[0]} possesses the requisite academic background and
        personal integrity to make a meaningful contribution to your organisation. Kindly extend to
        him/her the necessary assistance and guidance throughout the placement period.
      </p>

      <p>
        We look forward to your kind and favourable response. Please do not hesitate to contact our
        office for any further clarification.
      </p>

      <p>Yours faithfully,</p>
    </div>

    <!-- ── Signature ── -->
    <div class="signature-row">
      <div class="sig-block">
        <div class="sig-line"></div>
        <strong>Head of Department</strong><br />
        Department of ${department}<br />
        KNUST, Kumasi
      </div>
      <div class="stamp-circle">Official<br />Stamp</div>
    </div>

    <!-- ── Student Details Box ── -->
    <div class="details-box">
      <div class="details-header">Student Details</div>
      <div class="details-grid">
        <div><span>Full Name: </span><strong>${studentName}</strong></div>
        <div><span>Student ID: </span><strong>${studentId}</strong></div>
        <div><span>Programme: </span><strong>${department}</strong></div>
        <div><span>Level: </span><strong>${level}</strong></div>
        <div><span>Phone: </span><strong>${phone}</strong></div>
        <div><span>Email: </span><strong>${studentEmail}</strong></div>
        <div><span>Academic Supervisor: </span><strong>${supervisorName}</strong></div>
        <div><span>Duration: </span><strong>${duration}</strong></div>
      </div>
    </div>

    <!-- ── Footer ── -->
    <div class="footer-note">
      This letter is issued for the academic year ${new Date().getFullYear()}/${new Date().getFullYear() + 1} only and is valid solely for the purpose of industrial attachment.
      Any queries should be directed to the Department of ${department}, KNUST, Kumasi — registrar@knust.edu.gh
    </div>

  </div>

</body>
</html>`;

  // ── Open in new tab ───────────────────────────────────────────────────────
  const newTab = window.open("", "_blank");
  if (newTab) {
    newTab.document.write(html);
    newTab.document.close();
  } else {
    // Fallback: trigger download as .html file if popups are blocked
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `KNUST_Internship_Letter_${studentName.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export default generateInternshipLetter;