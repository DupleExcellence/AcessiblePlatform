import "./Feedback.css";
import Button from "../Button/Button"



function Feedback({ type = "success", title, message, onClose }) {
  const feedbackData = {
    success: {
      icon: "✓",
    },
    warning: {
      icon: "!",
    },
    error: {
      icon: "×",
    },
  };

  const data = feedbackData[type] || feedbackData.success;

  return (
    <div
      className={`feedback feedback-${type}`}
      role="alert"
    >
      <div
        className={`feedback-icon feedback-icon-${type}`}
        aria-hidden="true"
      >
        {data.icon}
      </div>

      <div className="feedback-content">
        <span className="feedback-title">
          {title}
        </span>

        <span className="feedback-message">
          {message}
        </span>
      </div>

      <Button
        type="button"
        className="feedback-close"
        onClick={onClose}
        aria-label={`Fechar mensagem: ${title}`}
      >
        ×
      </Button>
    </div>
  );
}

export default Feedback;

