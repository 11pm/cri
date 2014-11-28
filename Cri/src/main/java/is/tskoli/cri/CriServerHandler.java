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
    //the user connected by ws
    private User client;
    //the json from client
    private JSONObject json;
    
    @OnMessage
    public void handleClient(String jsonFromClient, Session s) {
        
        //convert string from client to JSON
        try {
            this.json = new JSONObject(jsonFromClient);
        } catch (JSONException ex) {
            Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        try {
            switch(this.json.getString("type")){
                //user request server to log him in
                case "login":

                    this.json = this.json.getJSONObject("data");
                    String username = (String) this.json.get("username");
                    String password = (String) this.json.get("password");
                    
                    //create User object
                    s.getUserProperties().put("user", new User(username, password, s));
                    //get the User obj stored in session
                    client = (User) s.getUserProperties().get("user");
                    try {
                        //check if cretentials are correct
                        if(client.login()){
                            //return user details, user friends                           
                                    
                            List<Map<String, String>> friends = client.friends;
                            Map<String, String> details = client.data;
                            s.getBasicRemote().sendText(new JSONObject().put("success", true).put("details", details).put("friends", friends).toString());
                            
                        }
                        else{
                            //send {"success": false} to client
                            s.getBasicRemote().sendText(new JSONObject().put("success", false).toString());
                        }
                    } catch (Exception ex) {
                        Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
                break;
                case "message":
                    this.json = this.json.getJSONObject("data");
                    String message = this.json.getString("message");
                    String sender = this.json.getString("sender");
                    String receiver = this.json.getString("receiver");
                            
                    client = (User) s.getUserProperties().get("user");
                    String responseMessage = new JSONObject().put("message", message).put("sender", sender).put("receiver", receiver).toString();
            
                    try {
                        //s.getBasicRemote().sendText(responseMessage);
                        
                        for (Session sesh : CriServerHandler.allUsers){
                            
                            //create user obj of session
                            User seshUser = (User) sesh.getUserProperties().get("user");
                            //s.getBasicRemote().sendText(new JSONObject().put("user", seshUser.username).toString());
                            
                            //send to the receiver on your friend list
                            if(client.isFriend(seshUser.username)){
                                
                                //send to you and your friend
                                s.getBasicRemote().sendText(responseMessage);
                                sesh.getBasicRemote().sendText(responseMessage);
                                
                                //s.getBasicRemote().sendText(new JSONObject().put("user", seshUser.username).toString());
                            }
                            
                            client.sendPrivate(sesh, responseMessage);
                            
                        }
                        
                    } catch (IOException ex) {
                        Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
           
                break;
            }
        } catch (JSONException ex) {
            Logger.getLogger(CriServerHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }
    
    @OnOpen
    public void onOpen (Session peer) {
        allUsers.add(peer);
    }

    @OnClose
    public void onClose (Session peer) {
        
        //get details about the user that is closing, set him offline
        User closingUser = (User) peer.getUserProperties().get("user");
        closingUser.online = false;
        
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