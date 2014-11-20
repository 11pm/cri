/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package is.tskoli.cri;

/**
 *
 * @author alexander
 */
public class User extends Database{
    
    public String username;
    public String password;
    
    public User(String username, String password) throws Exception{
        super.connect();
        this.username = username;
        this.password = password;
        System.out.println("Hello");
    }
    
    public Boolean login() throws Exception{
        return super.login(this);
    }
}
