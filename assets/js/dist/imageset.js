/*!
 * ImageSet (1.0.0-beta1)
 *
 * This script file is needed for lazyloading imagesets,
 * generated with ImageSet for Kirby and rendering placeholder
 * effeccts
 *
 * Copyright (c) 2016 Fabian Michael <hallo@fabianmichael.de>
 * @license SEE LICENSE IN license.md
 *
 * This script also includes:
 *
 *   StackBlur 0.6
 *   Copyright (c) 2010 Mario Klingemann <mario@quasimondo.com>
 *   https://github.com/Quasimondo/QuasimondoJS
 *
 *   lazysizes 2.0.7 (with "static-gecko-picture" plugin)
 *   Copyright (C) 2015 Alexander Farkas, released under MIT license
 *   https://github.com/aFarkas/lazysizes
 * 
 */

;(function(window, document, undefined){
	'use strict';

	// var mul_table = [
	//         512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
	//         454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
	//         482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
	//         437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
	//         497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
	//         320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
	//         446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
	//         329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
	//         505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
	//         399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
	//         324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
	//         268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
	//         451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
	//         385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
	//         332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
	//         289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
	        //'light' => 512, (7) / 15
	        // 'strong' => 512, / 17
	        
	   
	// var shg_table = [
	// 	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
	// 		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
	// 		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
	// 		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
	// 		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
	// 		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
	// 		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
	// 		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
	// 		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
	// 		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
	// 		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
	// 		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
	// 		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
	// 		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
	// 		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
	// 		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

	// function stackBlurImage( imageIDOrElement, canvasIDOrElement, radius, blurAlphaChannel )
	// {
				
	// 	var img = stackBlurGetElement( imageIDOrElement );
	// 	var w = img.naturalWidth;
	// 	var h = img.naturalHeight;
	       
	// 	var canvas = stackBlurGetElement( canvasIDOrElement );
	      
	//     canvas.style.width  = w + "px";
	//     canvas.style.height = h + "px";
	//     canvas.width = w;
	//     canvas.height = h;
	    
	//     var context = canvas.getContext("2d");
	//     context.clearRect( 0, 0, w, h );
	//     context.drawImage( img, 0, 0 );

	// 	if ( isNaN(radius) || radius < 1 ) return;
		
	// 	if ( blurAlphaChannel )
	// 		stackBlurCanvasRGBA( canvasIDOrElement, 0, 0, w, h, radius );
	// 	else 
	// 		stackBlurCanvasRGB( canvasIDOrElement, 0, 0, w, h, radius );
	// }


	function stackBlurCanvasRGBA( canvas, top_x, top_y, width, height, radius, mul_sum, shg_sum )
	{
		//var canvas    = stackBlurGetElement( canvasIDOrElement );
		var context   = canvas.getContext("2d");
		var imageData = context.getImageData( top_x, top_y, width, height );
		
		// try {
		//   try {
		// 	imageData = context.getImageData( top_x, top_y, width, height );
		//   } catch(e) {
		  
		// 	// NOTE: this part is supposedly only needed if you want to work with local files
		// 	// so it might be okay to remove the whole try/catch block and just use
		// 	// imageData = context.getImageData( top_x, top_y, width, height );
		// 	try {
		// 		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		// 		imageData = context.getImageData( top_x, top_y, width, height );
		// 	} catch(e) {
		// 		alert("Cannot access local image");
		// 		throw new Error("unable to access local image data: " + e);
		// 		return;
		// 	}
		//   }
		// } catch(e) {
		//   alert("Cannot access image");
		//   throw new Error("unable to access image data: " + e);
		// }
	  
		imageData = stackBlurImageDataRGBA( imageData, radius, mul_sum, shg_sum );
		context.putImageData( imageData, top_x, top_y );
	}


	function stackBlurImageDataRGBA( imageData, radius, mul_sum, shg_sum )
	{
		// if ( isNaN(radius) || radius < 1 ) return;
		// radius |= 0;
				
		var pixels = imageData.data,
				width  = imageData.width,
				height = imageData.height;
				
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
				r_out_sum, g_out_sum, b_out_sum, a_out_sum,
				r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
				pr, pg, pb, pa, rbs;
				
		var div 				 = radius + radius + 1,
				w4  				 = width << 2,
				widthMinus1  = width - 1,
				heightMinus1 = height - 1,
				radiusPlus1  = radius + 1,
				sumFactor    = radiusPlus1 * (radiusPlus1 + 1) / 2;
		
		var stackStart = new BlurStack();
		var stackEnd;
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		// var mul_sum = mul_table[radius];
		// var shg_sum = shg_table[radius];
		
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				pixels[yi+3] = (a_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				a_in_sum += ( stackIn.a = pixels[p+3]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
			   
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
				if ( pa > 0 )
				{
					pa = 255 / pa;
					pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
					pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
				} else {
					pixels[p] = pixels[p+1] = pixels[p+2] = 0;
				}
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;
			   
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
			   
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				a_out_sum += ( pa = stackOut.a );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
		
		return imageData;
		
	}


	function stackBlurCanvasRGB( canvas, top_x, top_y, width, height, radius, mul_sum, shg_sum )
	{
		// if ( isNaN(radius) || radius < 1 ) return;
		// radius |= 0;
		
		//var canvas    = stackBlurGetElement( canvasIDOrElement );
		var context   = canvas.getContext("2d");
		var imageData = context.getImageData( top_x, top_y, width, height );
		
		// try {
		//   try {
		// 	imageData = context.getImageData( top_x, top_y, width, height );
		//   } catch(e) {
		  
		// 	// NOTE: this part is supposedly only needed if you want to work with local files
		// 	// so it might be okay to remove the whole try/catch block and just use
		// 	// imageData = context.getImageData( top_x, top_y, width, height );
		// 	try {
		// 		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		// 		imageData = context.getImageData( top_x, top_y, width, height );
		// 	} catch(e) {
		// 		alert("Cannot access local image");
		// 		throw new Error("unable to access local image data: " + e);
		// 		return;
		// 	}
		//   }
		// } catch(e) {
		//   alert("Cannot access image");
		//   throw new Error("unable to access image data: " + e);
		// }
				
		var pixels = imageData.data;
				
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
		r_out_sum, g_out_sum, b_out_sum,
		r_in_sum, g_in_sum, b_in_sum,
		pr, pg, pb, rbs;
				
		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = radius + 1;
		var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
		
		var stackStart = new BlurStack();
		var stackEnd;
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var stackOut = null;
		
		yw = yi = 0;
		
		// var mul_sum = mul_table[radius];
		// var shg_sum = shg_table[radius];
		
		for ( y = 0; y < height; y++ )
		{
			r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
			
			r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			}
			
			
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
				pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
				
				r_in_sum += ( stackIn.r = pixels[p]);
				g_in_sum += ( stackIn.g = pixels[p+1]);
				b_in_sum += ( stackIn.b = pixels[p+2]);
				
				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;

				yi += 4;
			}
			yw += width;
		}

		
		for ( x = 0; x < width; x++ )
		{
			g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
			
			yi = x << 2;
			r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			
			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			
			stack = stackStart;
			
			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack = stack.next;
			}
			
			yp = width;
			
			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;
				
				r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
				g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
				b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
				
				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				
				stack = stack.next;
			
				if( i < heightMinus1 )
				{
					yp += width;
				}
			}
			
			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p]   = (r_sum * mul_sum) >> shg_sum;
				pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
				pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
				
				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				
				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				
				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
				
				r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
				g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
				b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
				
				stackIn = stackIn.next;
				
				r_out_sum += ( pr = stackOut.r );
				g_out_sum += ( pg = stackOut.g );
				b_out_sum += ( pb = stackOut.b );
				
				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				
				stackOut = stackOut.next;
				
				yi += width;
			}
		}
		
		context.putImageData( imageData, top_x, top_y );
		
	}

	function BlurStack()
	{
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	// function stackBlurGetElement( elementOrID )
	// {
	// 	if ( elementOrID.nodeType == 1 )
	// 		return elementOrID;

	// 	return document.getElementById( elementOrID );
	// }


	window.stackBlur = {
		canvasRGB:  stackBlurCanvasRGB,
		canvasRGBA: stackBlurCanvasRGBA,
	};

})(window, document);


;(function(window, document, Math, Date, undefined) {
  'use strict';

  if(!document.getElementsByClassName){ return; }  

  /* =====  Configuration  ================================================== */

  var prefix = 'imageset';

  var __wrapperClass                    = 'imageset',
      __wrapperLazyloadClass            = __wrapperClass + '  -lazyload',
      __wrapperLoadedClass              = 'is-loaded',
      __wrapperErrorClass               = 'has-error',
      __wrapperPlaceholderClass         = __wrapperClass + ' -placeholder',
      __wrapperPlaceholderStyleClass    = '-placeholder:',
      __wrapperAlphaClass               = '-alpha',
      __wrapperPlaceholderRenderedClass = 'is-placeholder-rendered',
      __wrapperPlaceholderErrorClass    = 'has-placeholder-error',
      __imageElementClass               = __wrapperClass + '-element',
      __placeholderElementClass         = __wrapperClass + '-placeholder',
      __errorOverlayClass               = 'imageset-error',
      __operaMiniClass                  = 'operamini';

  /* =====  Variable Shortcuts  ============================================= */

  var docElement               = document.documentElement;

  var ua                       = navigator.userAgent;

  /* =====  Utilities & Helper Functions  =================================== */
  
  /* -----  Polyfills  ------------------------------------------------------ */
      
  // Shim layer with setTimeout fallback. Look only for unprefixed
  // requestAnimationFrame, because all modern browsern already removed the
  // prefix.
  var rAF = window.requestAnimationFrame || function(fn) { setTimeout(fn, 1000/60); };

  /* -----  Utilities  ------------------------------------------------------ */

  function ready(fn) {
    if(document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Extend an object with another one
  function extend(base, obj) {
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        base[i] = obj[i];
      }
    }
    return base;
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function imageLoaded(img, success, failure) {
    failure = failure || false;

    if(!img.complete || (typeof img.naturalWidth === "undefined") || img.naturalWidth === 0) {

      var successCallback = function () {
        this.removeEventListener('load', successCallback);
        success();
      };

      img.addEventListener('load', successCallback);

      if(!!failure) {
        var testImg = new Image();
        testImg.addEventListener('error', function() {
          failure();
        });
        testImg.src = img.src;
      }
    } else {
      success();
    }
  }

  var RenderQueue = (function() {
    var queue       = [],
        inProgress  = false;

    function add(callback) {
      queue.push(callback);
      run();
    }

    function loop() {
      var callback = queue.shift();
      callback();

      if(!queue.length) {
        inProgress = false;
      } else {
        rAF(loop);
      }
    }

    function run() {
      if(inProgress) return;
      inProgress = true;
      rAF(loop);
    }

    return {
      add: add,
    };
  })();

  // Class utilities using `classList` API if available.
  // Fallbacks inspired by: https://gist.github.com/devongovett/1381839
  var hasClass = (function() {
    return docElement.classList ?
      function(el, cls) { return el.classList.contains(cls); } :
      function(el, cls) { return !!~el.className.split(/\s+/).indexOf(cls); };
  })();

  var addClass = (function() {
    return docElement.classList ?
      function(el, cls) { el.classList.add(cls); } :
      function(el, cls) {
        var classes = el.className.split(/\s+/);
        if(!~classes.indexOf(cls)) {
          classes.push(cls);
          el.className = classes.join(" ");
        }
      };
  })();

  var removeClass = (function() {
    return docElement.classList ?
      function(el, cls) { return el.classList.remove(cls); } :
      function(el, cls) {
        var tokens = el.className.split(/\s+/),
            index  = tokens.indexOf(cls);
        if(!!~index) {
          tokens.splice(index, 1);
          el.className = tokens.join(" ");
        }
      };
  })();

  function fixCanvasResolution(canvas, ctx) {
    // Adjustments for HiDPI/Retina screens
    var devicePixelRatio  = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1, // Compatibility with (older?) Safari
        pixelRatio        = devicePixelRatio / backingStoreRatio;

    if(devicePixelRatio !== backingStoreRatio) {
      var oldWidth        = canvas.width,
          oldHeight       = canvas.height;
      canvas.width        = oldWidth  * pixelRatio;
      canvas.height       = oldHeight * pixelRatio;
      //canvas.style.width  = oldWidth  + 'px';
      //canvas.style.height = oldHeight + 'px';
      ctx.scale(pixelRatio, pixelRatio);
    }

    return pixelRatio;
  }


  /* =====  ImageSets & Placeholders  ======================================= */

  /* -----  Special Initialization for Opera Mini  -------------------------- */

  var isOperaMini = (Object.prototype.toString.call(window.operamini) === "[object OperaMini]");

  if(isOperaMini) {
    // Opera Mini has limited DOM Event support and does not
    // work with lazysizes. So we shortcut the loading process
    // of lazy-loading and disable lazysizes.
    window.lazySizesConfig      = window.lazySizesConfig || {};
    window.lazySizesConfig.init = false;

    addClass(docElement, __operaMiniClass);

    var loadImageSetForOperaMini = function(wrapper) {
        
      var sources = wrapper.getElementsByTagName("source"),
          img     = wrapper.getElementsByClassName(__imageElementClass)[0];
    
      // Wrapper should be loaded to trigger css hook like
      // on other browsers.
      addClass(wrapper, __wrapperLoadedClass);

      if(window.HTMLPictureElement) {
        // As of December 2016, Opera Mini does not support
        // the picture element. However, we consider this
        // here for possible implementations in the future.
        for(var i = 0, l = sources.length; i < l; i++) {
          var s = sources[i];
          if(s.hasAttribute('data-srcset')) s.srcset = s.getAttribute('data-srcset');
          if(s.hasAttribute('data-src'))    s.src    = s.getAttribute('data-src');
        }

        if(img.hasAttribute('data-srcset')) img.srcset = img.getAttribute('data-srcset');
        if(img.hasAttribute('data-src'))    img.src    = img.getAttribute('data-src');

      } else {
        
        var fallbackSource = sources.length > 0 ? sources[sources.length - 1] : img,
            candidates     = fallbackSource.getAttribute('data-srcset').split(/,\s+/);

        while(sources.length > 0) {
          // Delete sources elements 
          sources[0].parentNode.removeChild(sources[0]);
        }

        img.src = candidates.pop().replace(/\s+\d+[wx]$/, '');
      }
    };

    ready(function() {
      var imagesets = document.getElementsByClassName(__wrapperClass);
      for(var i = 0, l = imagesets.length; i < l; i++) {
        loadImageSetForOperaMini(imagesets[i]);
      }
    });


    return; // Abort Initialization here
  }

  /* ===== Regular Initialization  ========================================== */

  /* ----- Global Variables Setup  ------------------------------------------ */
 
  /* ·····  ImageSet-specific Helper functions  ····························· */

  var placeholderRegexp = new RegExp(__wrapperPlaceholderStyleClass + '([a-z0-9_-]+)\\s*', 'i');

  function getPlaceholderStyle(wrapper) {
    var result = wrapper.className.match(placeholderRegexp);
    return result ? result[1] : false;
  }

  function handlePlaceholderError(wrapper) {
    addClass(wrapper, __wrapperPlaceholderErrorClass);
  }



  /* -----  Placeholder Render Functions  ----------------------------------- */
  
  var placeholderRenderer = {};

  if(!!window.CanvasRenderingContext2D) {
    // only register placeholder rendering functions, if
    // canvas is supported by the browser.

    /* ···  Mosaic  ························································· */

    var isSafari                    = (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1);
    var supportsPixelatedImages     = ('imageRendering' in docElement.style || 'msInterpolationMode' in docElement.style);

    if(!supportsPixelatedImages || isSafari) {

      placeholderRenderer.mosaic = function(wrapper) {

        var canvas      = document.createElement("canvas"),
            ctx         = canvas.getContext("2d"),
            source      = wrapper.getElementsByClassName(__placeholderElementClass)[0];

        var process = function() {

          fixCanvasResolution(canvas, ctx);

          var width        = source.naturalWidth,
              height       = source.naturalHeight,
              scaledWidth  = wrapper.offsetWidth,
              scaledHeight = (wrapper.offsetWidth / width * height + 0.5) | 0;

          canvas.width  = scaledWidth;
          canvas.height = scaledHeight;

          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.msImageSmoothingEnabled = false;
          ctx.imageSmoothingEnabled = false;
          
          canvas.setAttribute("aria-hidden", true);
          canvas.className = source.className;
          
          ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
          source.parentNode.replaceChild(canvas, source);
          addClass(wrapper, __wrapperPlaceholderRenderedClass);
        };

        return function() {
          imageLoaded(source, process, function() { handlePlaceholderError(wrapper); });
        };
      };
    }

    /* ···  Blurred & LQIP  ················································· */

    var applyPlaceholderBlur = function(wrapper, radius, mul_sum, shg_sum) {

      var source = wrapper.getElementsByClassName(__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = wrapper.offsetWidth,
            scaledHeight = (wrapper.offsetWidth / width * height + 0.5) | 0,
            
            canvas       = document.createElement("canvas"),
            ctx          = canvas.getContext("2d"),
            alpha        = hasClass(el, __wrapperAlphaClass);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;

        if(!alpha && 'mozOpaque' in canvas) {
          canvas.mozOpaque = true;
        }
        
        canvas.setAttribute("aria-hidden", true);
        canvas.className = source.className;
        
        ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
        stackBlur[alpha ? 'canvasRGBA' : 'canvasRGB'](canvas, 0, 0, scaledWidth, scaledHeight, radius, mul_sum, shg_sum);
        source.parentNode.replaceChild(canvas, source);
        addClass(wrapper, __wrapperPlaceholderRenderedClass);
      };

      return function() {
        imageLoaded(source, process, function() { handlePlaceholderError(wrapper); });
      };

    };

    placeholderRenderer.blurred = function(el) {
      return applyPlaceholderBlur(el, 15, 512, 17);
    };
    
    placeholderRenderer.lqip = function(el) {
      return applyPlaceholderBlur(el, 7, 512, 15);
    };

    /* ···  Triangles  ······················································ */

    var triangleMosaicFilter = function(canvas, side, alpha) {
        
      alpha = !!alpha;

      // Canvas Properties
      var ctx             = canvas.getContext('2d'),
          imageData       = ctx.getImageData(0, 0, canvas.width, canvas.height),
          pixels          = imageData.data,
          imageDataWidth  = imageData.width,
          imageDataHeight = imageData.height,
          xMax            = imageDataWidth  - 1,
          yMax            = imageDataHeight - 1;
          
      // Triangle Properties
      var height         = Math.round(side * (Math.sqrt(3)/2)), // Triangle height ((side * Math.sqrt(3) / 2) + 0.5) | 0, // 
          halfHeight     = height / 2,
          halfSide       = side   / 2;   

      //Update canvas if needed (HiDPI/Retina screens)
      fixCanvasResolution(canvas, ctx);
      
      // Utility functions
      var drawTriangle  = function(x, y, stroke, directionRight) {
        directionRight = directionRight || false;
        var xBase = x + (directionRight ? 0 : height);
        ctx.beginPath();
        ctx.moveTo(xBase, y + 0);
        ctx.lineTo(x + (directionRight ? height : 0),  y + halfSide);
        ctx.lineTo(xBase, y + side);
        ctx.fill();
        ctx.closePath();
      };

      // Utility functions
      var pickColor = function(x, y) {
        var colorOffset = y * imageDataWidth * 4 + x * 4;
        return [
          // Our dear friend IE does not support `slice()` on typed arrays,
          // falling back to doing it the hard way 🙄
          pixels[colorOffset],
          pixels[colorOffset + 1],
          pixels[colorOffset + 2],
          pixels[colorOffset + 3],
        ];
      };

      var getAlpha = function(x, y) {
        return pixels[y * imageDataWidth * 4 + x * 4 + 3];
      };

      var getAverageAlphaFromPoints = function(points) {
        var alpha = 0, i = 0, len = points.length;
        for(; i < len; i++) alpha += getAlpha(points[i][0], points[i][1]);
        return alpha / len;
      };

      var rgb = function(color) {
        return "rgb(" + color.slice(0, 3).join(",") + ")";
      };
      
      var rgba = function(color) {
        color[3] /= 255;
        return "rgba(" + color.join(",") + ")";
      };
      
      var sanitizeX = function(x) {
        return Math.max(0, Math.min(Math.round(x), xMax));
        // return Math.max(0, Math.min((x + 0.5) | 0, xMax));
      };
      
      var sanitizeY = function(y) {
        return Math.max(0, Math.min(Math.round(y), yMax));
        // return Math.max(0, Math.min((y + 0.5) | 0, yMax));
      };

      var stepX, xSteps = Math.ceil(imageDataWidth  / height) + 1, // make sure, that canvas is
          stepY, ySteps = Math.ceil(imageDataHeight / side)   + 1, // completely filled.
          posX, posY, sanitizedPosX, sanitizedPosY,
          rectColor,
          rectColorPosY,
          trianglePosY,
          triangleBaseX,
          triangleTipX,
          triangleColor,
          triangleColorPosY,
          triangleColorPosX,
          sanitizedTriangleCenterX,
          sanitizedTriangleCenterY,
          trianglePointsRight,
          points,
          averageAlpha,
          i;

      if(alpha) {
        // Generate Alpha Mask
        for(stepY = 0; stepY < ySteps; stepY++) {
          posY               = stepY * side;
          rectColorPosY      = sanitizeY(posY + halfSide);
          trianglePosY       = posY - halfSide;
          triangleColorPosY  = sanitizeY(posY);   
          
          for(stepX = 0; stepX < xSteps; stepX++) {
            posX = stepX * height;
            trianglePointsRight = stepX % 2 !== 0;
            sanitizedPosX       = sanitizeX(posX);
            sanitizedPosY       = sanitizeY(posY);
            
            // Get average alpha for rect and draw it
            triangleTipX             = sanitizeX(trianglePointsRight ? posX + height - 1 : posX);
            triangleBaseX            = sanitizeX(trianglePointsRight ? posX : posX + height - 1);
            sanitizedTriangleCenterX = sanitizeX(posX + halfHeight);
            sanitizedTriangleCenterY = sanitizeY(posY + halfSide);

            // For calculating alpha transparency, we’re using
            // the average color of the area covered by
            // triangles and rects. Although it’s slower than
            // picking the color value of a single pixel,
            // results are way better.
            points = [
              [ triangleBaseX            , sanitizedPosY              ],
              [ triangleTipX             , sanitizedTriangleCenterY   ],
              [ triangleBaseX            , sanitizeY(posY + side - 1) ],
              [ sanitizedTriangleCenterX , sanitizedTriangleCenterY   ],
              [ sanitizedTriangleCenterX , sanitizedTriangleCenterY   ],
            ];

            averageAlpha  = (getAverageAlphaFromPoints(points) + 0.5) | 0;
            ctx.fillStyle = rgba([averageAlpha, 0, 0, 255]);
            ctx.fillRect(posX, posY, height, side);

            // Get average alpha for triangle and draw it
            points = [
              [ triangleBaseX            , sanitizeY(posY - halfSide)     ],
              [ triangleTipX             , sanitizedPosY                  ],
              [ triangleBaseX            , sanitizeY(posY + halfSide - 1) ],
              [ sanitizedTriangleCenterX , sanitizedPosY                  ],
              [ sanitizedTriangleCenterX , sanitizedPosY                  ],
            ];

            averageAlpha  = (getAverageAlphaFromPoints(points) + 0.5) | 0;
            ctx.fillStyle = rgba([averageAlpha, 0, 0, 255]);
            drawTriangle(posX, trianglePosY, false, trianglePointsRight);
          }
        }

        // Move red channel to alpha channel
        var alphaImageData  = ctx.getImageData(0, 0, canvas.width, canvas.height),
            alphaData       = alphaImageData.data,
            alphaDataLength = alphaData.length;

        for(i = 0; i < alphaDataLength; i += 4) {
          alphaData[i + 3] = alphaData[i];
        }

        ctx.putImageData(alphaImageData, 0, 0);

        // Causes new pixels to be drawn only where the
        // 
        ctx.globalCompositeOperation = "source-atop";
      }

      // Draw the final triangle mosaic
      for(stepY = 0; stepY < ySteps; stepY++) {
        posY               = stepY * side;
        rectColorPosY      = sanitizeY(posY + halfSide);
        trianglePosY       = posY - halfSide;
        triangleColorPosY  = sanitizeY(posY);   
        for(stepX = 0; stepX < xSteps; stepX++) {
          // It’s faster and produces better looking results,
          // i.e. eliminates artifacts at the edges of triangles
          // when drawing a rect first and then draw a
          // triangle that if shifted upwards by half of it’s
          // height.
          posX                = stepX * height;
          triangleColorPosX   = sanitizeX(posX + halfHeight);
          trianglePointsRight = (stepX % 2 !== 0);

          // For the final layer, only one color is picked
          // for the rect and the triangle. This is way faster
          // than the method used to calculate the alpha mask,
          // but results are sufficient for a decent quality
          // of the result.
          ctx.fillStyle = rgb(pickColor(triangleColorPosX, rectColorPosY));
          ctx.fillRect(posX, posY, height, side);
          
          ctx.fillStyle = rgb(pickColor(triangleColorPosX, triangleColorPosY));
          drawTriangle(posX, trianglePosY, false, trianglePointsRight);
        }
      }

      if(alpha) {
        // Reset composite operation, in case that other
        // scripts want to manipulate the canvas further.
        ctx.globalCompositeOperation = "source-over";
      }
    };

    placeholderRenderer.triangles = function(wrapper) {

      var source   = wrapper.getElementsByClassName(__placeholderElementClass)[0];

      var process = function() {
        var width        = source.naturalWidth,
            height       = source.naturalHeight,
            scaledWidth  = wrapper.offsetWidth,
            scaledHeight = Math.round(wrapper.offsetWidth / width * height), // (scaledWidth / width * height + 0.5) | 0, // faster Math.round() hack // same as: 
            canvas       = document.createElement("canvas"),
            ctx          = canvas.getContext("2d"),
            alpha        = hasClass(wrapper, __wrapperAlphaClass);

        canvas.width  = scaledWidth;
        canvas.height = scaledHeight;

        if(!alpha && 'mozOpaque' in canvas) {
          canvas.mozOpaque = true;
        }
        
        canvas.setAttribute("aria-hidden", true);
        canvas.className = source.className;
        
        
        ctx.drawImage(source, 0, 0, scaledWidth, scaledHeight);
        triangleMosaicFilter(canvas, 40, alpha);
        source.parentNode.replaceChild(canvas, source);
        addClass(wrapper, __wrapperPlaceholderRenderedClass);
        console.log('placeholder rendered');
      };

      return function() {
        imageLoaded(source, process, function() { handlePlaceholderError(wrapper); });
      };
    };

  }

  /* =====  ImageSet  ======================================================= */

  function ImageSet() {

    // ---  settings

    var settings = window.imagesetConfig = extend({
      
      autoUpdate: true,
      placeholderRendering: 'async',

    }, window.imagesetConfig || {});
    
    var imagesetElements = document.getElementsByClassName(__wrapperPlaceholderClass);

    var _paused = false;

    var queue = [];

    // ---  private methods
    
    function checkImagesets() {
      var style, wrapper, renderer;

      for(var i = 0, l = imagesetElements.length; i < l; i++) {
        if(!imagesetElements[i]) continue;

        wrapper = imagesetElements[i];

        if(hasClass(wrapper, __wrapperPlaceholderRenderedClass)) continue;

        style = getPlaceholderStyle(wrapper);
        
        if(style && placeholderRenderer[style]) {
          // Render placeholder, if a renderer for given
          // imageset exists.

          renderer = placeholderRenderer[style](wrapper);

          if(settings.placeholderRendering === 'async') {
            RenderQueue.add(renderer);
          } else {
            renderer();
          }
        }
      }

    }

    var debouncedCheckImagesets = debounce(checkImagesets);

    // ---  initialization

    // ···  transition

    document.addEventListener('lazybeforeunveil', function (e) {

      var element = e.target,
          wrapper = element.parentNode;

      if(!hasClass(element, __imageElementClass)) return;

      while(!hasClass(wrapper, __wrapperClass)) {
        // Get imageset container element by traversing up the DOM tree
        wrapper = wrapper.parentNode;
      }

      // Define a callback function which gets invoked, after an image has
      // finally loaded.
      var success = function () {
        element.removeEventListener("load", success);
        rAF(function () {
          // Asynchronously add loaded class
          addClass(wrapper, __wrapperLoadedClass);
        });
      };

      var error = function () {
        element.removeEventListener("error", error);
        rAF(function () {

          var errorOverlay = document.createElement('span');
          addClass(errorOverlay, __errorOverlayClass);

          if(element.hasAttribute('alt') && element.alt !== '') {

            errorOverlay.setAttribute('aria-hidden', true);
            errorOverlay.appendChild(document.createTextNode(element.alt));
          }

          wrapper.appendChild(errorOverlay);

          // Asynchronously add loaded class
          rAF(function() {
            addClass(wrapper, __wrapperErrorClass);
          });

        });
      };

      
      element.addEventListener("load", success);
      element.addEventListener("error", error);
    });

    // ··· auto-update

    if(settings.autoUpdate) {
      if(!!window.MutationObserver) {
        // Use MutationObserver to check for new elements,
        // if supported.
        new window.MutationObserver( debouncedCheckImagesets ).observe( docElement, {childList: true, subtree: true, attributes: false, characterData: false } );
      } else {
        // Otherwise, fallback to Mutation Events and add
        // a setInterval for as a safety fallback.
        docElement.addEventListener('DOMNodeInserted', debouncedCheckImagesets, true);
        docElement.addEventListener('DOMAttrModified', debouncedCheckImagesets, true);
        setInterval(debouncedCheckImagesets, 999);
      }

      window.addEventListener('hashchange', debouncedCheckImagesets, true);
      
      debouncedCheckImagesets();
    } else {
      // If autoUpdate is disabled, check imagesets just once.
      ready(checkImagesets);
    }

    return {
      update: checkImagesets,
    };

  }

  var imageset = new ImageSet();

  window.imageset = imageset;

})(window, document, Math, Date);

/**
 * FF's first picture implementation is static and does not react to viewport changes, this tiny script fixes this.
 */
(function(window) {
	/*jshint eqnull:true */
	var ua = navigator.userAgent;

	if ( window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 41) ) {
		addEventListener("resize", (function() {
			var timer;

			var dummySrc = document.createElement("source");

			var fixRespimg = function(img) {
				var source, sizes;
				var picture = img.parentNode;

				if (picture.nodeName.toUpperCase() === "PICTURE") {
					source = dummySrc.cloneNode();

					picture.insertBefore(source, picture.firstElementChild);
					setTimeout(function() {
						picture.removeChild(source);
					});
				} else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
					img._pfLastSize = img.offsetWidth;
					sizes = img.sizes;
					img.sizes += ",100vw";
					setTimeout(function() {
						img.sizes = sizes;
					});
				}
			};

			var findPictureImgs = function() {
				var i;
				var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
				for (i = 0; i < imgs.length; i++) {
					fixRespimg(imgs[i]);
				}
			};
			var onResize = function() {
				clearTimeout(timer);
				timer = setTimeout(findPictureImgs, 99);
			};
			var mq = window.matchMedia && matchMedia("(orientation: landscape)");
			var init = function() {
				onResize();

				if (mq && mq.addListener) {
					mq.addListener(onResize);
				}
			};

			dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

			if (/^[c|i]|d$/.test(document.readyState || "")) {
				init();
			} else {
				document.addEventListener("DOMContentLoaded", init);
			}

			return onResize;
		})());
	}
})(window);

/*
This lazySizes extension adds better support for print.
In case the user starts to print lazysizes will load all images.
*/
(function(window){
	/*jshint eqnull:true */
	'use strict';
	var config, elements, onprint, printMedia;
	// see also: http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
	if(window.addEventListener){
		config = (window.lazySizes && lazySizes.cfg) || window.lazySizesConfig || {};
		elements = config.lazyClass || 'lazyload';
		onprint = function(){
			var i, len;
			if(typeof elements == 'string'){
				elements = document.getElementsByClassName(elements);
			}

			if(window.lazySizes){
				for(i = 0, len = elements.length; i < len; i++){
					lazySizes.loader.unveil(elements[i]);
				}
			}
		};

		addEventListener('beforeprint', onprint, false);

		if(!('onbeforeprint' in window) && window.matchMedia && (printMedia = matchMedia('print')) && printMedia.addListener){
			printMedia.addListener(function(){
				if(printMedia.matches){
					onprint();
				}
			});
		}
	}
})(window);

(function(window, factory) {
	var lazySizes = factory(window, window.document);
	window.lazySizes = lazySizes;
	if(typeof module == 'object' && module.exports){
		module.exports = lazySizes;
	}
}(window, function l(window, document) {
	'use strict';
	/*jshint eqnull:true */
	if(!document.getElementsByClassName){return;}

	var lazySizesConfig;

	var docElem = document.documentElement;

	var Date = window.Date;

	var supportPicture = window.HTMLPictureElement;

	var _addEventListener = 'addEventListener';

	var _getAttribute = 'getAttribute';

	var addEventListener = window[_addEventListener];

	var setTimeout = window.setTimeout;

	var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

	var requestIdleCallback = window.requestIdleCallback;

	var regPicture = /^picture$/i;

	var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

	var regClassCache = {};

	var forEach = Array.prototype.forEach;

	var hasClass = function(ele, cls) {
		if(!regClassCache[cls]){
			regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		}
		return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
	};

	var addClass = function(ele, cls) {
		if (!hasClass(ele, cls)){
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
		}
	};

	var removeClass = function(ele, cls) {
		var reg;
		if ((reg = hasClass(ele,cls))) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
		}
	};

	var addRemoveLoadEvents = function(dom, fn, add){
		var action = add ? _addEventListener : 'removeEventListener';
		if(add){
			addRemoveLoadEvents(dom, fn);
		}
		loadEvents.forEach(function(evt){
			dom[action](evt, fn);
		});
	};

	var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
		var event = document.createEvent('CustomEvent');

		event.initCustomEvent(name, !noBubbles, !noCancelable, detail || {});

		elem.dispatchEvent(event);
		return event;
	};

	var updatePolyfill = function (el, full){
		var polyfill;
		if( !supportPicture && ( polyfill = (window.picturefill || lazySizesConfig.pf) ) ){
			polyfill({reevaluate: true, elements: [el]});
		} else if(full && full.src){
			el.src = full.src;
		}
	};

	var getCSS = function (elem, style){
		return (getComputedStyle(elem, null) || {})[style];
	};

	var getWidth = function(elem, parent, width){
		width = width || elem.offsetWidth;

		while(width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth){
			width =  parent.offsetWidth;
			parent = parent.parentNode;
		}

		return width;
	};

	var rAF = (function(){
		var running, waiting;
		var fns = [];

		var run = function(){
			var fn;
			running = true;
			waiting = false;
			while(fns.length){
				fn = fns.shift();
				fn[0].apply(fn[1], fn[2]);
			}
			running = false;
		};

		var rafBatch = function(fn){
			if(running){
				fn.apply(this, arguments);
			} else {
				fns.push([fn, this, arguments]);

				if(!waiting){
					waiting = true;
					(document.hidden ? setTimeout : requestAnimationFrame)(run);
				}
			}
		};

		rafBatch._lsFlush = run;

		return rafBatch;
	})();

	var rAFIt = function(fn, simple){
		return simple ?
			function() {
				rAF(fn);
			} :
			function(){
				var that = this;
				var args = arguments;
				rAF(function(){
					fn.apply(that, args);
				});
			}
		;
	};

	var throttle = function(fn){
		var running;
		var lastTime = 0;
		var gDelay = 125;
		var RIC_DEFAULT_TIMEOUT = 666;
		var rICTimeout = RIC_DEFAULT_TIMEOUT;
		var run = function(){
			running = false;
			lastTime = Date.now();
			fn();
		};
		var idleCallback = requestIdleCallback ?
			function(){
				requestIdleCallback(run, {timeout: rICTimeout});
				if(rICTimeout !== RIC_DEFAULT_TIMEOUT){
					rICTimeout = RIC_DEFAULT_TIMEOUT;
				}
			}:
			rAFIt(function(){
				setTimeout(run);
			}, true)
		;

		return function(isPriority){
			var delay;
			if((isPriority = isPriority === true)){
				rICTimeout = 44;
			}

			if(running){
				return;
			}

			running =  true;

			delay = gDelay - (Date.now() - lastTime);

			if(delay < 0){
				delay = 0;
			}

			if(isPriority || (delay < 9 && requestIdleCallback)){
				idleCallback();
			} else {
				setTimeout(idleCallback, delay);
			}
		};
	};

	//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
	var debounce = function(func) {
		var timeout, timestamp;
		var wait = 99;
		var run = function(){
			timeout = null;
			func();
		};
		var later = function() {
			var last = Date.now() - timestamp;

			if (last < wait) {
				setTimeout(later, wait - last);
			} else {
				(requestIdleCallback || run)(run);
			}
		};

		return function() {
			timestamp = Date.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};


	var loader = (function(){
		var lazyloadElems, preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

		var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

		var defaultExpand, preloadExpand, hFac;

		var regImg = /^img$/i;
		var regIframe = /^iframe$/i;

		var supportScroll = ('onscroll' in window) && !(/glebot/.test(navigator.userAgent));

		var shrinkExpand = 0;
		var currentExpand = 0;

		var isLoading = 0;
		var lowRuns = -1;

		var resetPreloading = function(e){
			isLoading--;
			if(e && e.target){
				addRemoveLoadEvents(e.target, resetPreloading);
			}

			if(!e || isLoading < 0 || !e.target){
				isLoading = 0;
			}
		};

		var isNestedVisible = function(elem, elemExpand){
			var outerRect;
			var parent = elem;
			var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

			eLtop -= elemExpand;
			eLbottom += elemExpand;
			eLleft -= elemExpand;
			eLright += elemExpand;

			while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
				visible = ((getCSS(parent, 'opacity') || 1) > 0);

				if(visible && getCSS(parent, 'overflow') != 'visible'){
					outerRect = parent.getBoundingClientRect();
					visible = eLright > outerRect.left &&
						eLleft < outerRect.right &&
						eLbottom > outerRect.top - 1 &&
						eLtop < outerRect.bottom + 1
					;
				}
			}

			return visible;
		};

		var checkElements = function() {
			var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

			if((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

				i = 0;

				lowRuns++;

				if(preloadExpand == null){
					if(!('expand' in lazySizesConfig)){
						lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
					}

					defaultExpand = lazySizesConfig.expand;
					preloadExpand = defaultExpand * lazySizesConfig.expFactor;
				}

				if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden){
					currentExpand = preloadExpand;
					lowRuns = 0;
				} else if(loadMode > 1 && lowRuns > 1 && isLoading < 6){
					currentExpand = defaultExpand;
				} else {
					currentExpand = shrinkExpand;
				}

				for(; i < eLlen; i++){

					if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

					if(!supportScroll){unveilElement(lazyloadElems[i]);continue;}

					if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
						elemExpand = currentExpand;
					}

					if(beforeExpandVal !== elemExpand){
						eLvW = innerWidth + (elemExpand * hFac);
						elvH = innerHeight + elemExpand;
						elemNegativeExpand = elemExpand * -1;
						beforeExpandVal = elemExpand;
					}

					rect = lazyloadElems[i].getBoundingClientRect();

					if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
						(eLtop = rect.top) <= elvH &&
						(eLright = rect.right) >= elemNegativeExpand * hFac &&
						(eLleft = rect.left) <= eLvW &&
						(eLbottom || eLright || eLleft || eLtop) &&
						((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
						unveilElement(lazyloadElems[i]);
						loadedSomething = true;
						if(isLoading > 9){break;}
					} else if(!loadedSomething && isCompleted && !autoLoadElem &&
						isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
						(preloadElems[0] || lazySizesConfig.preloadAfterLoad) &&
						(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto')))){
						autoLoadElem = preloadElems[0] || lazyloadElems[i];
					}
				}

				if(autoLoadElem && !loadedSomething){
					unveilElement(autoLoadElem);
				}
			}
		};

		var throttledCheckElements = throttle(checkElements);

		var switchLoadingClass = function(e){
			addClass(e.target, lazySizesConfig.loadedClass);
			removeClass(e.target, lazySizesConfig.loadingClass);
			addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
		};
		var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
		var rafSwitchLoadingClass = function(e){
			rafedSwitchLoadingClass({target: e.target});
		};

		var changeIframeSrc = function(elem, src){
			try {
				elem.contentWindow.location.replace(src);
			} catch(e){
				elem.src = src;
			}
		};

		var handleSources = function(source){
			var customMedia, parent;

			var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

			if( (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
				source.setAttribute('media', customMedia);
			}

			if(sourceSrcset){
				source.setAttribute('srcset', sourceSrcset);
			}

			//https://bugzilla.mozilla.org/show_bug.cgi?id=1170572
			if(customMedia){
				parent = source.parentNode;
				parent.insertBefore(source.cloneNode(), source);
				parent.removeChild(source);
			}
		};

		var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
			var src, srcset, parent, isPicture, event, firesLoad;

			if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

				if(sizes){
					if(isAuto){
						addClass(elem, lazySizesConfig.autosizesClass);
					} else {
						elem.setAttribute('sizes', sizes);
					}
				}

				srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
				src = elem[_getAttribute](lazySizesConfig.srcAttr);

				if(isImg) {
					parent = elem.parentNode;
					isPicture = parent && regPicture.test(parent.nodeName || '');
				}

				firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

				event = {target: elem};

				if(firesLoad){
					addRemoveLoadEvents(elem, resetPreloading, true);
					clearTimeout(resetPreloadingTimer);
					resetPreloadingTimer = setTimeout(resetPreloading, 2500);

					addClass(elem, lazySizesConfig.loadingClass);
					addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
				}

				if(isPicture){
					forEach.call(parent.getElementsByTagName('source'), handleSources);
				}

				if(srcset){
					elem.setAttribute('srcset', srcset);
				} else if(src && !isPicture){
					if(regIframe.test(elem.nodeName)){
						changeIframeSrc(elem, src);
					} else {
						elem.src = src;
					}
				}

				if(srcset || isPicture){
					updatePolyfill(elem, {src: src});
				}
			}

			rAF(function(){
				if(elem._lazyRace){
					delete elem._lazyRace;
				}
				removeClass(elem, lazySizesConfig.lazyClass);

				if( !firesLoad || elem.complete ){
					if(firesLoad){
						resetPreloading(event);
					} else {
						isLoading--;
					}
					switchLoadingClass(event);
				}
			});
		});

		var unveilElement = function (elem){
			var detail;

			var isImg = regImg.test(elem.nodeName);

			//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
			var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
			var isAuto = sizes == 'auto';

			if( (isAuto || !isCompleted) && isImg && (elem.src || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass)){return;}

			detail = triggerEvent(elem, 'lazyunveilread').detail;

			if(isAuto){
				 autoSizer.updateElem(elem, true, elem.offsetWidth);
			}

			elem._lazyRace = true;
			isLoading++;

			lazyUnveil(elem, detail, isAuto, sizes, isImg);
		};

		var onload = function(){
			if(isCompleted){return;}
			if(Date.now() - started < 999){
				setTimeout(onload, 999);
				return;
			}
			var afterScroll = debounce(function(){
				lazySizesConfig.loadMode = 3;
				throttledCheckElements();
			});

			isCompleted = true;

			lazySizesConfig.loadMode = 3;

			throttledCheckElements();

			addEventListener('scroll', function(){
				if(lazySizesConfig.loadMode == 3){
					lazySizesConfig.loadMode = 2;
				}
				afterScroll();
			}, true);
		};

		return {
			_: function(){
				started = Date.now();

				lazyloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass);
				preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
				hFac = lazySizesConfig.hFac;

				addEventListener('scroll', throttledCheckElements, true);

				addEventListener('resize', throttledCheckElements, true);

				if(window.MutationObserver){
					new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
				} else {
					docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
					docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
					setInterval(throttledCheckElements, 999);
				}

				addEventListener('hashchange', throttledCheckElements, true);

				//, 'fullscreenchange'
				['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function(name){
					document[_addEventListener](name, throttledCheckElements, true);
				});

				if((/d$|^c/.test(document.readyState))){
					onload();
				} else {
					addEventListener('load', onload);
					document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
					setTimeout(onload, 20000);
				}

				if(lazyloadElems.length){
					checkElements();
				} else {
					throttledCheckElements();
				}
			},
			checkElems: throttledCheckElements,
			unveil: unveilElement
		};
	})();


	var autoSizer = (function(){
		var autosizesElems;

		var sizeElement = rAFIt(function(elem, parent, event, width){
			var sources, i, len;
			elem._lazysizesWidth = width;
			width += 'px';

			elem.setAttribute('sizes', width);

			if(regPicture.test(parent.nodeName || '')){
				sources = parent.getElementsByTagName('source');
				for(i = 0, len = sources.length; i < len; i++){
					sources[i].setAttribute('sizes', width);
				}
			}

			if(!event.detail.dataAttr){
				updatePolyfill(elem, event.detail);
			}
		});
		var getSizeElement = function (elem, dataAttr, width){
			var event;
			var parent = elem.parentNode;

			if(parent){
				width = getWidth(elem, parent, width);
				event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

				if(!event.defaultPrevented){
					width = event.detail.width;

					if(width && width !== elem._lazysizesWidth){
						sizeElement(elem, parent, event, width);
					}
				}
			}
		};

		var updateElementsSizes = function(){
			var i;
			var len = autosizesElems.length;
			if(len){
				i = 0;

				for(; i < len; i++){
					getSizeElement(autosizesElems[i]);
				}
			}
		};

		var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

		return {
			_: function(){
				autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
				addEventListener('resize', debouncedUpdateElementsSizes);
			},
			checkElems: debouncedUpdateElementsSizes,
			updateElem: getSizeElement
		};
	})();

	var init = function(){
		if(!init.i){
			init.i = true;
			autoSizer._();
			loader._();
		}
	};

	(function(){
		var prop;

		var lazySizesDefaults = {
			lazyClass: 'lazyload',
			loadedClass: 'lazyloaded',
			loadingClass: 'lazyloading',
			preloadClass: 'lazypreload',
			errorClass: 'lazyerror',
			//strictClass: 'lazystrict',
			autosizesClass: 'lazyautosizes',
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',
			sizesAttr: 'data-sizes',
			//preloadAfterLoad: false,
			minSize: 40,
			customMedia: {},
			init: true,
			expFactor: 1.5,
			hFac: 0.8,
			loadMode: 2
		};

		lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

		for(prop in lazySizesDefaults){
			if(!(prop in lazySizesConfig)){
				lazySizesConfig[prop] = lazySizesDefaults[prop];
			}
		}

		window.lazySizesConfig = lazySizesConfig;

		setTimeout(function(){
			if(lazySizesConfig.init){
				init();
			}
		});
	})();

	return {
		cfg: lazySizesConfig,
		autoSizer: autoSizer,
		loader: loader,
		init: init,
		uP: updatePolyfill,
		aC: addClass,
		rC: removeClass,
		hC: hasClass,
		fire: triggerEvent,
		gW: getWidth,
		rAF: rAF,
	};
}
));

