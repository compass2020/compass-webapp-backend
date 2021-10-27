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

public class ControlpointTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Controlpoint.class);
        Controlpoint controlpoint1 = new Controlpoint();
        controlpoint1.setId(1L);
        Controlpoint controlpoint2 = new Controlpoint();
        controlpoint2.setId(controlpoint1.getId());
        assertThat(controlpoint1).isEqualTo(controlpoint2);
        controlpoint2.setId(2L);
        assertThat(controlpoint1).isNotEqualTo(controlpoint2);
        controlpoint1.setId(null);
        assertThat(controlpoint1).isNotEqualTo(controlpoint2);
    }
}
