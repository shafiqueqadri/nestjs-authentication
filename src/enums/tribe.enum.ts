export enum ETribeActivityType {
    MESSAGE = 'message',
    CREATED = 'created',
    UPDATED = 'updated',
    REQUESTED = 'requested',
    JOINED = 'joined',
    VIEWED = 'viewed',
    LEFT = 'left',
    LIKED = 'liked',
    DISLIKE = 'disliked',
    SUBMITTED_SURVEY = 'survey_submitted',
    SUBMITTED_POST = 'post_submitted',
    SUBMITTED_ASSIGNMENT = 'survey_assignment',
    YOUTUBE_CONNECTED = 'youtube_connected',
    YOUTUBE_DISCONNECTED = 'youtube_disconnected'
}

export enum ETribePostType {
    FEED = 'feed',
    SURVEY = 'survey',
    ASSIGNMENT = 'assignment'
}

export enum ETribePrivacy {
    PUBLIC = 'public',
    PRIVATE = 'private'
}