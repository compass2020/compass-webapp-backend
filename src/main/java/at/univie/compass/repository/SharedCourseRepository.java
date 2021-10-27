/*-
 * #%L
 * COMPASS orienteering game
 * %%
 * Copyright (C) 2021 University of Vienna
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
package at.univie.compass.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import at.univie.compass.domain.SharedCourse;

/**
 * Spring Data  repository for the SharedCourse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SharedCourseRepository extends JpaRepository<SharedCourse, Long> {
    
    @Query("select sharedCourse from SharedCourse sharedCourse where sharedCourse.course.createdBy = ?#{principal.username}")
    List<SharedCourse> findByUserIsCurrentUser();

    @Query("select sharedCourse from SharedCourse sharedCourse where sharedCourse.course.id = :id and sharedCourse.course.createdBy = ?#{principal.username}")
    List<SharedCourse> findByCourseIdAndCurrentUser(@Param("id") Long id);
    
    Optional<SharedCourse> findOneByQrCode(String qrCode);
}
