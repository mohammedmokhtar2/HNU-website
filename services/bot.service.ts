// import axios from 'axios';

export interface AiBotRequest {
  content: string;
  sessionId: string;
}

export interface AiBotResponse {
  output: string;
}

class BotService {
  private static readonly WEBHOOK_URL =
    'https://nonconsumable-heaping-nicolasa.ngrok-free.dev/webhook/f9bdb1a9-891d-40eb-8738-e9a64104197d';

  // post request for the n8n webhook
  // static async postRequest(data: AiBotRequest): Promise<AiBotResponse> {
  //   console.log(this.WEBHOOK_URL);
  //   console.log('sending data to webhook....');
  //   const response = await axios.post(this.WEBHOOK_URL, data);
  //   return response.data;
  // }

  // Generate a unique session ID
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get session ID from localStorage or create a new one
  static getSessionId(): string {
    if (typeof window === 'undefined') {
      return this.generateSessionId();
    }

    let sessionId = localStorage.getItem('bot_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('bot_session_id', sessionId);
    }
    return sessionId;
  }

  // Clear session ID from localStorage
  static clearSessionId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bot_session_id');
    }
  }

  // Clear messages for a specific session
  static clearSessionMessages(sessionId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`bot_messages_${sessionId}`);
    }
  }
}

export default BotService;
