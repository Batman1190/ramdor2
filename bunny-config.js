// Bunny.net configuration and utility functions

class BunnyService {
    constructor() {
        this.BUNNY_API_KEY = process.env.BUNNY_API_KEY;
        this.LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
        this.HOSTNAME = process.env.BUNNY_HOSTNAME;
        this.BASE_URL = `https://video.bunnycdn.com/library/${this.LIBRARY_ID}`;
    }

    async createVideo(title) {
        const response = await fetch(`${this.BASE_URL}/videos`, {
            method: 'POST',
            headers: {
                'AccessKey': this.BUNNY_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                collectionId: this.COLLECTION_ID
            })
        });

        return await response.json();
    }

    async uploadVideo(videoId, file) {
        const response = await fetch(`${this.BASE_URL}/videos/${videoId}`, {
            method: 'PUT',
            headers: {
                'AccessKey': this.BUNNY_API_KEY
            },
            body: file
        });

        return await response.json();
    }

    async deleteVideo(videoId) {
        const response = await fetch(`${this.BASE_URL}/videos/${videoId}`, {
            method: 'DELETE',
            headers: {
                'AccessKey': this.BUNNY_API_KEY
            }
        });

        return response.ok;
    }

    getVideoStreamUrl(videoId) {
        return `https://${this.HOSTNAME}/${videoId}/play`;
    }

    getThumbnailUrl(videoId) {
        return `https://${this.HOSTNAME}/${videoId}/thumbnail.jpg`;
    }
}

export const bunnyService = new BunnyService();