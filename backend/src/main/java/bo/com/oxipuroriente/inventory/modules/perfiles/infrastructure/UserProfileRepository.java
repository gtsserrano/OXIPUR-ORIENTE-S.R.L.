package bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    @Query("select count(p) > 0 from UserProfile p where upper(trim(p.fullName)) = upper(trim(:fullName))")
    boolean existsByNormalizedFullName(String fullName);

    @Query("select count(p) > 0 from UserProfile p where upper(trim(p.fullName)) = upper(trim(:fullName)) and p.id <> :id")
    boolean existsByNormalizedFullNameAndIdNot(String fullName, Long id);

    @Query("select count(p) > 0 from UserProfile p where upper(trim(p.username)) = upper(trim(:username))")
    boolean existsByNormalizedUsername(String username);

    @Query("select count(p) > 0 from UserProfile p where upper(trim(p.username)) = upper(trim(:username)) and p.id <> :id")
    boolean existsByNormalizedUsernameAndIdNot(String username, Long id);

    @Query("select p from UserProfile p where upper(trim(p.username)) = upper(trim(:username))")
    Optional<UserProfile> findByNormalizedUsername(String username);
}
