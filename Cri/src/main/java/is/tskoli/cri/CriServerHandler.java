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
import java.util.logging.*;
/**
 *
 * @author alexander
 */
@ServerEndpoint("/server")
public class CriServerHandler{
    private static Set<Session> allUsers = Collections.synchronizedSet(new HashSet<Session>());
   
    Logger logger = Logger.getAnonymousLogger();
    
    
    @OnMessage
    public void handleClient(String jsonFromClient, Session s) {
        //get user from session
        User clientUser = (User) s.getUserProperties().get("user");
        
        JSONObject obj = null;
        try {
            obj = new JSONObject(jsonFromClient);
        } catch (JSONException ex) {
            Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        try {
            switch(obj.getString("type")){
                //user request server to log him in
                case "login":

                    JSONObject data = obj.getJSONObject("data");
                    String username = (String) data.get("username");
                    String password = (String) data.get("password");
                    
                    //create User object
                    s.getUserProperties().put("user", new User(username, password, s));
                    //get the User obj stored in session
                    clientUser = (User) s.getUserProperties().get("user");
                    try {
                        //check if cretentials are correct
                        if(clientUser.login()){
                            //return user details, user friends
                            
                                    
                            List<Map<String, String>> friends = clientUser.friends;
                            Map<String, String> details = clientUser.data;
                            s.getBasicRemote().sendText("ayy lmao");
                            //return new JSONObject().put("success", true).put("details", details).put("friends", friends).toString();

                        }
                        else{
                            //send {"success": false} to client
                            //return new JSONObject().put("success", false).toString();
                        }
                    } catch (Exception ex) {
                        Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
            
                case "message":
                    //return clientUser.test();
                    
                    
            }
        } catch (JSONException ex) {
            Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        
      
          
        
    }
    
    @OnOpen
    public void onOpen (Session peer) {
        
    }

    @OnClose
    public void onClose (Session peer) {
        allUsers.remove(peer);
    }

    @OnError
    public String onError(Throwable t) {
        return t.getMessage();
    }
    
    public static void main(String[] args){
        System.out.println("Hello world");
    }
}
