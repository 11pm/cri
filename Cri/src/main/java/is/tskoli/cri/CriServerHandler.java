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
    private static User clientUser;
    
    @OnMessage
    public String handleClient(String jsonFromClient, Session s) throws JSONException, Exception  {
     
        JSONObject obj = new JSONObject(jsonFromClient);

            switch(obj.getString("type")){
                //user request server to log him in
                case "login":

                    JSONObject data = obj.getJSONObject("data");
                    String username = (String) data.get("username");
                    String password = (String) data.get("password");
                    //create User object
                    clientUser = new User(username, password, s);
                    
                    
                    //check if cretentials are correct
                    if(clientUser.login()){
                        //return user details, user friends
                        List<Map<String, String>> friends = clientUser.friends;
                        Map<String, String> details = clientUser.data;
                        return new JSONObject().put("success", true).put("details", details).put("friends", friends).toString();
                        
                    }
                    else{
                        //send {"success": false} to client
                        return new JSONObject().put("success", false).toString();
                    }
                case "message":
                    return clientUser.test();
                    
                    
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
