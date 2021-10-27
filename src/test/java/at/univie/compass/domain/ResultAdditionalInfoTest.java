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

public class ResultAdditionalInfoTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ResultAdditionalInfo.class);
        ResultAdditionalInfo resultAdditionalInfo1 = new ResultAdditionalInfo();
        resultAdditionalInfo1.setId(1L);
        ResultAdditionalInfo resultAdditionalInfo2 = new ResultAdditionalInfo();
        resultAdditionalInfo2.setId(resultAdditionalInfo1.getId());
        assertThat(resultAdditionalInfo1).isEqualTo(resultAdditionalInfo2);
        resultAdditionalInfo2.setId(2L);
        assertThat(resultAdditionalInfo1).isNotEqualTo(resultAdditionalInfo2);
        resultAdditionalInfo1.setId(null);
        assertThat(resultAdditionalInfo1).isNotEqualTo(resultAdditionalInfo2);
    }
}
