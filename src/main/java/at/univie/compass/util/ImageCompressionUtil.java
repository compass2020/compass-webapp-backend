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
package at.univie.compass.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Iterator;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImageCompressionUtil {

    private final static Logger log = LoggerFactory.getLogger(ImageCompressionUtil.class);

    private static final float COMPRESSION_FAKTOR = 0.5f;

    public static byte[] convert(byte[] imageBas64) {

        byte[] compressedBase64 = null;

        try (ByteArrayOutputStream os = new ByteArrayOutputStream();
                ImageOutputStream ios = ImageIO.createImageOutputStream(os)) {

            log.debug("Size (bytes) before compression: " + imageBas64.length);

            final BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBas64));

            final Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
            final ImageWriter writer = writers.next();
            writer.setOutput(ios);

            final ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(COMPRESSION_FAKTOR);
            writer.write(null, new IIOImage(image, null, null), param);

            compressedBase64 = os.toByteArray();
            log.debug("Size (bytes) after compression: " + compressedBase64.length);

            if (writer != null) {
                writer.dispose();
            }

        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }

        return compressedBase64;
    }

    public static void main(String[] args) throws IOException {

        File file = new File("/Users/hero/Downloads/test/test2.jpg");

        byte[] image = Files.readAllBytes(file.toPath());
        byte[] compressedImage = convert(image);

        FileUtils.writeByteArrayToFile(new File("/Users/hero/Downloads/test/compressed.jpeg"), compressedImage);
    }
}
