/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.*;
//import org.json.*;
/**
 *
 * @author alexander
 */
@ServerEndpoint("/server")
public class CriServerHandler{
    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());

    @OnMessage
    public String handleClient(String jsonFromClient) throws IOException, JSONException {
        
        JSONObject obj = new JSONObject(jsonFromClient);

        String returns = null;
        switch(obj.getString("type")){
            //user request server to log him in
            case "login":
                
                User u = new User();
                
                JSONObject data = obj.getJSONObject("data");
                String username = (String) data.get("username");
                String password = (String) data.get("password");
                
                if(u.login(username, password)){
                    returns = "yay";
                }
                else{
                    returns = "nay";
                }
                
                break;
        }
        return returns;
        //return "You reached this part, something bad happended";
    }
    
    @OnOpen
    public int onOpen (Session peer) {
        peers.add(peer);
        return peers.size();
    }

    @OnClose
    public void onClose (Session peer) {
        peers.remove(peer);
    }

    @OnError
    public void onError(Throwable t) {
        
    }
}
