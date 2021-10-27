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

import at.univie.compass.domain.ResultControlpoint;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the ResultControlpoint entity.
 */
@Repository
public interface ResultControlpointRepository extends JpaRepository<ResultControlpoint, Long> {

    @Query(value = "select distinct resultControlpoint from ResultControlpoint resultControlpoint left join fetch resultControlpoint.resultQuestions",
        countQuery = "select count(distinct resultControlpoint) from ResultControlpoint resultControlpoint")
    Page<ResultControlpoint> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct resultControlpoint from ResultControlpoint resultControlpoint left join fetch resultControlpoint.resultQuestions")
    List<ResultControlpoint> findAllWithEagerRelationships();

    @Query("select resultControlpoint from ResultControlpoint resultControlpoint left join fetch resultControlpoint.resultQuestions where resultControlpoint.id =:id")
    Optional<ResultControlpoint> findOneWithEagerRelationships(@Param("id") Long id);
}
