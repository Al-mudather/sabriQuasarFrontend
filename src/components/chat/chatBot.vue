<template>
  <div>
    <!-- Chat Toggle Button -->
    <div class="chat-toggle" @click="toggleChat" :class="{ active: chatOpen }">
      <div class="chat-icon">
        <q-icon v-if="!chatOpen" name="chat_bubble" size="28px" />
        <q-icon v-else name="close" size="28px" />
      </div>
      <div v-if="hasNewMessage && !chatOpen" class="new-message-badge">
        {{ unreadCount }}
      </div>
    </div>

    <!-- Chat Window -->
    <transition name="slide-up">
      <div v-if="chatOpen" class="chat-window">
        <!-- Simple Header -->
        <div class="chat-header">
          <div class="user-info">
            <div class="avatar">
              <q-icon name="support_agent" size="24px" />
              <div class="online-indicator" v-if="!isTyping"></div>
            </div>
            <div class="details">
              <div class="status" :class="{ typing: isTyping }">
                <div class="status-content">
                  <div
                    class="status-dot"
                    :class="{ online: !isTyping, typing: isTyping }"
                  ></div>
                  <span v-if="isTyping">يكتب الآن...</span>
                  <span v-else>متاح الآن</span>
                </div>
              </div>
            </div>
          </div>
          <!-- <q-btn
            icon="close"
            flat
            round
            size="sm"
            @click="toggleChat"
            class="close-btn"
          /> -->
        </div>

        <!-- Messages -->
        <div class="messages-area" ref="messagesContainer">
          <!-- Welcome when no messages -->
          <div v-if="chatHistory.length === 0" class="welcome-area">
            <div class="welcome-text">
              <h3>👋 أهلاً وسهلاً</h3>
              <p>كيف يمكنني مساعدتك اليوم؟</p>
            </div>
          </div>

          <!-- Chat Messages -->
          <div
            v-for="(msg, index) in chatHistory"
            :key="index"
            class="message-row"
            :class="msg.sender"
          >
            <div class="message">
              <div class="text">{{ msg.text }}</div>
              <div class="time">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="message-row assistant">
            <div class="message typing">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-area">
          <div class="input-box">
            <q-input
              v-model="userInput"
              @keypress.enter.prevent="sendMessage"
              placeholder="اكتب رسالتك..."
              :disabled="isTyping"
              class="text-input"
              type="textarea"
              autogrow
              :max-height="120"
              outlined
              dense
              hide-bottom-space
              input-style="resize: none; border: none; outline: none; background: transparent; padding: 8px 12px; font-size: 14px; font-family: inherit; line-height: 1.4;"
            />
            <button
              @click="sendMessage"
              :disabled="!userInput.trim() || isTyping"
              class="send-btn"
              :class="{ ready: userInput.trim() }"
            >
              <q-icon name="send" />
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <div v-if="chatOpen" class="backdrop" @click="toggleChat"></div>
  </div>
</template>

<script>
export default {
  name: "MudassirChat",
  data() {
    return {
      userInput: "",
      chatHistory: [],
      isTyping: false,
      chatOpen: false,
      hasNewMessage: false,
      unreadCount: 0,
    };
  },
  methods: {
    toggleChat() {
      this.chatOpen = !this.chatOpen;
      if (this.chatOpen) {
        this.hasNewMessage = false;
        this.unreadCount = 0;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async sendMessage() {
      const input = this.userInput.trim();
      if (!input || this.isTyping) return;

      // Add user message
      this.chatHistory.push({
        sender: "user",
        text: input,
        timestamp: new Date(),
      });

      this.userInput = "";
      this.isTyping = true;

      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        // Send to n8n webhook
        const res = await fetch(
          "https://tz8k0f84.rpcl.host/webhook/stc-support",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
          }
        );

        const data = await res.json();

        // Extract response from n8n webhook - handle both array and object formats
        let fullResponse = "عذراً، لم أتمكن من فهم ذلك.";

        if (data) {
          // If response is an array, get first element's output
          if (Array.isArray(data) && data[0] && data[0].output) {
            fullResponse = data[0].output;
          }
          // If response is direct object with output field
          else if (data.output) {
            fullResponse = data.output;
          }
          // Fallback: check for reply field (original format)
          else if (data.reply) {
            fullResponse = data.reply;
          }
        }

        // Simulate typing effect with real response
        await this.typeMessage(fullResponse);
      } catch (error) {
        console.error("Chat error:", error);
        this.chatHistory.push({
          sender: "assistant",
          text: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
          timestamp: new Date(),
        });
      }

      this.isTyping = false;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    async typeMessage(message) {
      let displayed = "";
      const messageObj = {
        sender: "assistant",
        text: "",
        timestamp: new Date(),
      };

      this.chatHistory.push(messageObj);

      for (let i = 0; i < message.length; i++) {
        displayed += message[i];
        messageObj.text = displayed;
        await new Promise((r) => setTimeout(r, 30));
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop =
          this.$refs.messagesContainer.scrollHeight;
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return "";
      return new Date(timestamp).toLocaleTimeString("ar", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  watch: {
    chatHistory: {
      handler(newHistory) {
        if (!this.chatOpen && newHistory.length > 0) {
          const lastMessage = newHistory[newHistory.length - 1];
          if (lastMessage.sender === "assistant") {
            this.hasNewMessage = true;
            this.unreadCount++;
          }
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/css/helpers/_variabels.scss";

// Chat Toggle Button
.chat-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: $mainColor;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1001;
  color: white;
  border: none;
  outline: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }

  &.active {
    background: #ff4757;
  }

  .chat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .new-message-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: $yalloColor;
    color: $mainColor;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

// Backdrop
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

// Chat Window
.chat-window {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

// Header
.chat-header {
  background: white;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .avatar {
      width: 40px;
      height: 40px;
      background: $mainColor;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;

      .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #4caf50;
        border: 2px solid white;
        border-radius: 50%;
        animation: pulse-green 2s infinite;
      }
    }

    .details {
      .status {
        .status-content {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;

            &.online {
              background: #4caf50;
              animation: pulse-green 2s infinite;
            }

            &.typing {
              background: $mainColor;
              animation: pulse-blue 1s infinite;
            }
          }

          span {
            color: #666;

            &.typing {
              color: $mainColor;
            }
          }
        }

        &.typing {
          .status-content span {
            color: $mainColor;
          }
        }
      }
    }
  }

  .close-btn {
    color: #999;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    padding: 0 !important;
    margin: 0 !important;

    &:hover {
      color: #666;
      background: rgba(0, 0, 0, 0.05) !important;
    }

    .q-btn__wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
    }

    .q-icon {
      font-size: 20px;
    }
  }
}

// Messages Area
.messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
}

// Welcome Area
.welcome-area {
  text-align: center;
  margin-top: 40px;

  .welcome-text {
    margin-bottom: 30px;

    h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 20px;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 15px;
    }
  }
}

// Messages
.message-row {
  margin-bottom: 15px;
  display: flex;

  &.user {
    justify-content: flex-end;

    .message {
      background: $mainColor;
      color: white;
      border-radius: 18px 18px 5px 18px;
    }
  }

  &.assistant {
    justify-content: flex-start;

    .message {
      background: #f1f3f5;
      color: #333;
      border-radius: 18px 18px 18px 5px;

      &.typing {
        padding: 15px 20px;
      }
    }
  }

  .message {
    max-width: 70%;
    padding: 12px 16px;

    .text {
      line-height: 1.4;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .time {
      font-size: 11px;
      opacity: 0.7;
      text-align: right;
    }
  }
}

// Typing Animation
.typing-dots {
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

// Input Area
.input-area {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: white;

  .input-box {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: #f8f9fa;
    border-radius: 25px;
    padding: 8px;

    .text-input {
      flex: 1;

      ::v-deep .q-field__control {
        border: none !important;
        border-radius: 20px !important;
        background: transparent !important;
        min-height: 35px !important;
        padding: 0 !important;
      }

      ::v-deep .q-field__outlined {
        border: none !important;
      }

      ::v-deep .q-field__native {
        padding: 8px 12px !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        color: #333 !important;
        resize: none !important;
      }

      ::v-deep .q-field__control::before,
      ::v-deep .q-field__control::after {
        border: none !important;
      }

      ::v-deep .q-placeholder {
        color: #999 !important;
      }
    }

    .send-btn {
      width: 35px;
      height: 35px;
      min-width: 35px;
      min-height: 35px;
      border: none;
      border-radius: 50%;
      background: #ddd;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.ready {
        background: $mainColor;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}

// Animations
@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes pulse-green {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse-blue {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// Transitions
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

// Mobile Responsive
@media (max-width: 480px) {
  .chat-window {
    right: 15px;
    width: calc(100vw - 30px);
    height: calc(100vh - 120px);
    bottom: 80px;
  }

  .chat-toggle {
    right: 20px;
    bottom: 20px;
  }
}
</style>
