/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package no.ntnu.tollefsen.template;

import java.math.BigDecimal;
import java.util.List;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import no.ntnu.tollefsen.template.domain.Group;
import no.ntnu.tollefsen.template.domain.Item;
import no.ntnu.tollefsen.template.domain.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

/**
 *
 * @author rasmu
 */
@Path("fant")
@Stateless
public class FindService {
    @PersistenceContext
    EntityManager ent;
    
    @Inject
    JsonWebToken principal;
    
    @GET
    @RolesAllowed( value = {Group.USER})
    public Item getHello(@QueryParam("name") String name)
    {
        System.out.println("This user is" + principal.getName());
        
        User user = ent.find(User.class, principal.getName());
        
        Item result = new Item(null, name, BigDecimal.ONE, "Desc", user, null);
        ent.persist(result);
        return result;
    }
    
    @GET
    @Path("all")
    public List<Item> getAll() {
        return ent.createQuery("Select i from Item i", Item.class).getResultList();
    }
}
