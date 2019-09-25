/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package no.ntnu.tollefsen.template;

import java.util.List;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import no.ntnu.tollefsen.template.domain.Group;
import no.ntnu.tollefsen.template.domain.Item;
import org.eclipse.microprofile.jwt.JsonWebToken;

/**
 *
 * @author rasmu
 */
@Path("sellable")
@Stateless
public class ItemService {
    @PersistenceContext
    EntityManager ent;
    
    @Inject
    JsonWebToken principal;
    
    @GET
    public List<Item> getAll() {
        return ent.createQuery("Select i from Item i", Item.class).getResultList();
    }
    
}
