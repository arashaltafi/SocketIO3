package com.arash.altafi.socketio3.repositories;

import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONObject;

import java.util.ArrayList;
import io.socket.emitter.Emitter;
import com.arash.altafi.socketio3.App;
import com.arash.altafi.socketio3.interfaces.CommentCheck;

import static com.arash.altafi.socketio3.utils.Constant.COMMENT;

public class CommentRepository {

    private App app;
    private AppCompatActivity context;
    private CommentCheck commentCheck;
    private ArrayList<JSONObject> objectArrayList;

    public CommentRepository(AppCompatActivity context, CommentCheck commentCheck){
        this.context = context;
        this.commentCheck = commentCheck;
        app = (App) context.getApplication();
        objectArrayList = new ArrayList<>();
    }

    public void loadComment(){
        if (app.getSocketStream() != null)
            app.getSocketStream().on(COMMENT, comment_listener);
    }

    private Emitter.Listener comment_listener = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            context.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject object = (JSONObject) args[0];
                    objectArrayList.add(object);
                    commentCheck.onTask(objectArrayList);
                }
            });
        }
    };
}
