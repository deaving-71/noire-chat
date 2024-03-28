import vine from "@vinejs/vine";

export const updateNotificationValidator = vine.compile(
    vine.object({
        private_chat_id: vine.number(),
    })
)