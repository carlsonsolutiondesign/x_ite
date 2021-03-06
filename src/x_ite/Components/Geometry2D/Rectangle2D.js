/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the X_ITE Project.
 *
 * X_ITE is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * X_ITE is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with X_ITE.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"x_ite/Fields",
	"x_ite/Basic/X3DFieldDefinition",
	"x_ite/Basic/FieldDefinitionArray",
	"x_ite/Components/Rendering/X3DGeometryNode",
	"x_ite/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Vector2,
          Vector3)
{
"use strict";

	var defaultSize = new Vector2 (2, 2);

	function Rectangle2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .Rectangle2D);

		this .setGeometryType (2);

		this .size_ .setUnit ("length");
	}

	Rectangle2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Rectangle2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "size",     new Fields .SFVec2f (2, 2)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new Fields .SFBool ()),
		]),
		getTypeName: function ()
		{
			return "Rectangle2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		build: function ()
		{
			var
				options  = this .getBrowser () .getRectangle2DOptions (),
				geometry = options .getGeometry (),
				size     = this .size_ .getValue ();

			this .setTexCoords (geometry .getTexCoords ());
			this .setNormals   (geometry .getNormals ());

			if (size .equals (defaultSize))
			{
				this .setVertices (geometry .getVertices ());

				this .getMin () .assign (geometry .getMin ());
				this .getMax () .assign (geometry .getMax ());
			}
			else
			{
				var
					scale           = Vector3 .divide (size, 2),
					x               = scale .x,
					y               = scale .y,
					defaultVertices = geometry .getVertices (),
					vertices        = this .getVertices ();

				for (var i = 0; i < defaultVertices .length; i += 4)
				{
					vertices .push (x * defaultVertices [i],
					                y * defaultVertices [i + 1],
					                defaultVertices [i + 2],
					                1);
				}

				this .getMin () .set (-x, -y, 0);
				this .getMax () .set ( x,  y, 0);
			}

			this .setSolid (this .solid_ .getValue ());
		},
	});

	return Rectangle2D;
});
