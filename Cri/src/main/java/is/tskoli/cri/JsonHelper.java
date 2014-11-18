/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;
import java.io.StringReader;
import java.io.StringWriter;
import javax.json.Json;
import javax.json.JsonObject;

/**
 *
 * @author alexander
 */
public class JsonHelper {
    private JsonObject json;
    
    JsonHelper(String _json){
        this.setJson(_json);
    }

    public JsonObject getJson(){
        return json;
    }
    
    public void setJson(String newJson){
        this.json = Json.createReader(new StringReader(newJson)).readObject();
    }
    
    @Override
    public String toString(){
        StringWriter writer = new StringWriter();
        Json.createWriter(writer).write(json);
        return writer.toString();
    }
}