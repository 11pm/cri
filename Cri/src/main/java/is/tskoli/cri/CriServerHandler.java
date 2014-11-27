/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;

import java.io.IOException;
import java.util.*;
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
    private User clientUser;
    
    @OnMessage
    public String handleClient(String jsonFromClient) throws JSONException, Exception  {
     
        JSONObject obj = new JSONObject(jsonFromClient);

            switch(obj.getString("type")){
                //user request server to log him in
                case "login":

                    JSONObject data = obj.getJSONObject("data");
                    String username = (String) data.get("username");
                    String password = (String) data.get("password");
                    //create User object
                    clientUser = new User(username, password);
                    
                    //check if cretentials are correct
                    if(clientUser.login()){
                        //return user details, user friends
                        List<Friend> friends = clientUser.friends;
                        Map<String, String> details = clientUser.data;
                        return new JSONObject().put("success", true).put("details", details).toString();
                        
                    }
                    else{
                        //send {"success": false} to client
                        return new JSONObject().put("success", false).toString();
                    }

            }
        return "le 500";    
        //return obj.getString("type");     
        
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
    
    public static void main(String[] args){
        System.out.println("Hello world");
    }
}
