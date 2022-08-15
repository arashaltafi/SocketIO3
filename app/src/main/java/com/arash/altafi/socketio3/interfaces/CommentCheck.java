package com.arash.altafi.socketio3.interfaces;

import org.json.JSONObject;

import java.util.List;

public interface CommentCheck {
    void onTask(List<JSONObject> commentModelList);
    void onError(Exception e);
}
