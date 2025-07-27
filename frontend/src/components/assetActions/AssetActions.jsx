import React, { useState } from "react";
import styles from "../../pages/Asset/Asset.module.css";
import downloadExcel from "../../services/DownloadExcel";
import { BACKEND_BASE_URL, ROUTE_CONSTANTS } from "../../constants/ApiConstants";

const AssetActions = ({ active, inactive }) => {
  const [loading, setLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "Asset Report",
    content: "Please find attached the asset report.",
  });
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [allAssets, setAllAssets] = useState([]);

  // Fetch all assets from new backend route
  const fetchAllAssets = async () => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/all-assets`);
    const result = await response.json();
    return Array.isArray(result.assets) ? result.assets : [];
  };

  // Download all assets as Excel
  const fetchAllAssetsAndDownload = async () => {
    try {
      setLoading(true);
      const allAssets = await fetchAllAssets();
      downloadExcel(allAssets);
      setAllAssets(allAssets);
    } catch (error) {
      console.error("Failed to download asset report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExcelBlob = async (assets) => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  };

  const handleEmailReport = async (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    setEmailLoading(true);
    try {
      let assets = allAssets.length ? allAssets : await fetchAllAssets();
      const excelBlob = await getExcelBlob(assets);
      const formData = new FormData();
      formData.append("to", emailForm.to);
      formData.append("subject", emailForm.subject);
      formData.append("content", emailForm.content);
      formData.append("file", excelBlob, "AssetReport.xlsx");
      const resp = await fetch(`${BACKEND_BASE_URL}/api/send-asset-report`, {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) throw new Error("Failed to send email");
      setEmailSuccess("Email sent successfully!");
      setAllAssets([]);
    } catch {
      setEmailError("Failed to send email. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleEmailInput = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.assetSummaryContainer}>
      <div className={styles.assetCard}>
        <span>ACTIVE ASSETS</span>
        <span>{active}</span>
      </div>
      <div className={`${styles.assetCard} ${styles.inactive}`}>
        <span>IN ACTIVE ASSETS</span>
        <span>{inactive}</span>
      </div>
      <div className={`${styles.assetCard} ${styles.download}`} onClick={fetchAllAssetsAndDownload}>
        <span>{loading ? "DOWNLOADING..." : "DOWNLOAD REPORT (.XLS)"}</span>
      </div>
      <div
        className={`${styles.assetCard} ${styles.download}`}
        style={{ background: "#8fa2b8", color: "#fff", justifyContent: "center", cursor: "pointer" }}
        onClick={() => setEmailModal(true)}
      >
        <span>{emailLoading ? "SENDING..." : "EMAIL REPORT"}</span>
      </div>

      {/* Email Modal */}
      {emailModal && (
        <div className={styles["asset-details-background"]}>
          <div
            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0005", zIndex: 10 }}
            onClick={() => setEmailModal(false)}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              zIndex: 20,
              minWidth: 340,
              boxShadow: "0 2px 16px #0002",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16 }}>Send Asset Report</h3>
            <form onSubmit={handleEmailReport}>
              <div style={{ marginBottom: 12 }}>
                <label>To:&nbsp;</label>
                <input
                  type="email"
                  name="to"
                  required
                  value={emailForm.to}
                  onChange={handleEmailInput}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Subject:&nbsp;</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={emailForm.subject}
                  onChange={handleEmailInput}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Content:&nbsp;</label>
                <textarea
                  name="content"
                  required
                  value={emailForm.content}
                  onChange={handleEmailInput}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
                  rows={4}
                />
              </div>
              {emailError && <div style={{ color: "red", marginBottom: 8 }}>{emailError}</div>}
              {emailSuccess && <div style={{ color: "green", marginBottom: 8 }}>{emailSuccess}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setEmailModal(false)}
                  style={{ padding: "6px 16px", borderRadius: 4, border: "none", background: "#eee", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailLoading}
                  style={{ padding: "6px 16px", borderRadius: 4, border: "none", background: "#3b8ee1", color: "#fff", cursor: "pointer" }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetActions;
