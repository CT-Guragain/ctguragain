// Feedback form — AJAX submit to Formspree with inline status message

const feedbackForm = document.getElementById('feedbackForm');
const formStatus = document.getElementById('formStatus');

if (feedbackForm) {
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = feedbackForm.querySelector('.feedback-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(feedbackForm.action, {
        method: 'POST',
        body: new FormData(feedbackForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = "Thank you for feedback! Your message has been sent. ";
        formStatus.classList.add('success');
        feedbackForm.reset();
      } else {
        const data = await response.json().catch(() => null);
        const errorMsg = data && data.errors
          ? data.errors.map((err) => err.message).join(', ')
          : 'Something went wrong. Please try again.';
        formStatus.textContent = errorMsg;
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.textContent = "Network error — please check your connection and try again. ";
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}
