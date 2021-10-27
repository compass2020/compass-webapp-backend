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

public class ResultAnswerTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResultAnswer.class);
        ResultAnswer resultAnswer1 = new ResultAnswer();
        resultAnswer1.setId(1L);
        ResultAnswer resultAnswer2 = new ResultAnswer();
        resultAnswer2.setId(resultAnswer1.getId());
        assertThat(resultAnswer1).isEqualTo(resultAnswer2);
        resultAnswer2.setId(2L);
        assertThat(resultAnswer1).isNotEqualTo(resultAnswer2);
        resultAnswer1.setId(null);
        assertThat(resultAnswer1).isNotEqualTo(resultAnswer2);
    }
}
