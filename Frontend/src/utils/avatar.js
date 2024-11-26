async function storeOrGetAvatar(imageUrl, userId) {
    // Check localStorage first
    const cachedAvatar = localStorage.getItem(`avatar-${userId}`)

    if (cachedAvatar) {
        return cachedAvatar
    }

    // If not found, fetch and convert to base64
    try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                // Store base64 string in localStorage
                localStorage.setItem(`avatar-${userId}`, reader.result)
                resolve(reader.result)
            }
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        console.error("Error caching avatar:", error)
        return imageUrl // Fallback to original URL
    }
}

export default storeOrGetAvatar
