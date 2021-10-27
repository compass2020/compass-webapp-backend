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

public class ControlpointInfoTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ControlpointInfo.class);
        ControlpointInfo controlpointInfo1 = new ControlpointInfo();
        controlpointInfo1.setId(1L);
        ControlpointInfo controlpointInfo2 = new ControlpointInfo();
        controlpointInfo2.setId(controlpointInfo1.getId());
        assertThat(controlpointInfo1).isEqualTo(controlpointInfo2);
        controlpointInfo2.setId(2L);
        assertThat(controlpointInfo1).isNotEqualTo(controlpointInfo2);
        controlpointInfo1.setId(null);
        assertThat(controlpointInfo1).isNotEqualTo(controlpointInfo2);
    }
}
