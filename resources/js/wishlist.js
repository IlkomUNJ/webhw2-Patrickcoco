// Function to handle wishlist actions
function handleWishlistAction(form, isAdding = true) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const heartIcon = form.querySelector('.fa-heart');
        
        // Toggle heart icon
        heartIcon.classList.toggle('fas', data.inWishlist);
        heartIcon.classList.toggle('far', !data.inWishlist);
        heartIcon.classList.toggle('text-red-500', data.inWishlist);
        heartIcon.classList.toggle('text-gray-400', !data.inWishlist);

        // If we're in the wishlist page and removing an item
        if (!isAdding && window.location.pathname.includes('/wishlist')) {
          const productCard = form.closest('.bg-white');
          productCard.remove();

          // If no more products, reload to show empty state
          if (document.querySelectorAll('.bg-white').length === 0) {
            window.location.reload();
          }
        }

        // Show success message
        showToast(data.message);
      } else {
        showToast('Something went wrong. Please try again.');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.');
    }
  });
}

// Toast notification function
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
}

// Initialize wishlist forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Handle add to wishlist forms
  document.querySelectorAll('form[action*="wishlists"]').forEach(form => {
    const isAddingToWishlist = !form.querySelector('input[name="_method"][value="DELETE"]');
    handleWishlistAction(form, isAddingToWishlist);
  });
});