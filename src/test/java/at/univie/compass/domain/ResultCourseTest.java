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
package at.univie.compass.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import at.univie.compass.web.rest.TestUtil;

public class ResultCourseTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResultCourse.class);
        ResultCourse resultCourse1 = new ResultCourse();
        resultCourse1.setId(1L);
        ResultCourse resultCourse2 = new ResultCourse();
        resultCourse2.setId(resultCourse1.getId());
        assertThat(resultCourse1).isEqualTo(resultCourse2);
        resultCourse2.setId(2L);
        assertThat(resultCourse1).isNotEqualTo(resultCourse2);
        resultCourse1.setId(null);
        assertThat(resultCourse1).isNotEqualTo(resultCourse2);
    }
}
