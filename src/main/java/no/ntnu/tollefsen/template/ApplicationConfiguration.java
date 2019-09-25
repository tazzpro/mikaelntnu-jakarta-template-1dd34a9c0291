package no.ntnu.tollefsen.template;

import javax.annotation.security.DeclareRoles;
import javax.enterprise.context.ApplicationScoped;
import javax.security.enterprise.identitystore.DatabaseIdentityStoreDefinition;
import javax.security.enterprise.identitystore.PasswordHash;
import no.ntnu.tollefsen.template.domain.Group;
import org.eclipse.microprofile.auth.LoginConfig;

/**
 *
 * @author mikael
 */
@ApplicationScoped
@DatabaseIdentityStoreDefinition(
    dataSourceLookup=DatasourceProducer.JNDI_NAME,
    callerQuery="select password from auser where userid = ?",
    groupsQuery="select name from ausergroup where userid  = ?",
    hashAlgorithm = PasswordHash.class,
    priority = 80)
@DeclareRoles({Group.ADMIN,Group.USER})
@LoginConfig(authMethod = "MP-JWT",realmName = "template")
public class ApplicationConfiguration {
    
}
