/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author alexander
 */
@ServerEndpoint("/server")
public class CriServerHandler {
    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());

    @OnMessage
    public String onMessage(String message) {
        return "Ayy LMAO!";
    }
    @OnOpen
    public String onOpen () {
        return "ayy lmao!";
    }

    @OnClose
    public void onClose (Session peer) {
        peers.remove(peer);
    }

    @OnError
    public void onError(Throwable t) {
        
    }
}
