import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLetters from "../Hooks/UseLetters";
import LetterCard from "../Components/LetterCard/LetterCard";
import LetterPreviewModal from "../Components/Shared/LetterPreviewModal";
import Toast from "../Components/Shared/Toast";
import "../Styles/ApproveLetters.css";

const ApproveLetters = () => {
  const navigate = useNavigate();

  const {
    pendingLetters, processedLetters,
    previewLetter, toast,
    loading, processingId,
    handleApprove, handleReject,
    openPreview, closePreview,
  } = useLetters();

  return (
    <div className="approve-container">

      {/* Header */}
      <div className="approve-nav">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <div className="page-title">
          <h1>Approve Internship Letters</h1>
          <p>Review and approve student letter requests</p>
        </div>
      </div>

      {/* Content */}
      <div className="approve-content">

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>⏳</div>
            <p style={{ fontWeight:600, color:"#6b7280", fontSize:15 }}>
              Loading letter requests...
            </p>
            <p style={{ fontSize:13, color:"#9ca3af", marginTop:4 }}>
              Connecting to database
            </p>
          </div>
        ) : (
          <>
            {/* Pending Section */}
            <section className="letters-section">
              <h2 className="section-title">
                Pending Requests ({pendingLetters.length})
              </h2>
              {pendingLetters.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-title">No pending requests</p>
                  <p className="empty-hint">All letters have been processed</p>
                </div>
              ) : (
                <div className="letters-grid">
                  {pendingLetters.map((letter) => (
                    <LetterCard
                      key={letter.id}
                      letter={letter}
                      onPreview={openPreview}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      processing={processingId === letter.id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Processed Section */}
            {processedLetters.length > 0 && (
              <section className="letters-section">
                <h2 className="section-title">
                  Processed Requests ({processedLetters.length})
                </h2>
                <div className="letters-grid">
                  {processedLetters.map((letter) => (
                    <LetterCard
                      key={letter.id}
                      letter={letter}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

      </div>

      {previewLetter && (
        <LetterPreviewModal letter={previewLetter} onClose={closePreview} />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
};

export default ApproveLetters;