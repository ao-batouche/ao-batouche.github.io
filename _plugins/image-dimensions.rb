require 'open3'

module Jekyll
  module ImageDimensions
    # Cache one ImageMagick query per source image across all generated pages.
    def image_dimensions(path)
      return {} if path.to_s.empty? || path.to_s.include?('://')

      site = @context.registers[:site]
      cache = site.instance_variable_get(:@image_dimensions_cache) || {}
      site.instance_variable_set(:@image_dimensions_cache, cache)
      cache[path] ||= begin
        source = File.expand_path(path.to_s.delete_prefix('/'), site.source)
        if source.start_with?(File.expand_path(site.source) + '/') && File.file?(source)
          output, _error, status = Open3.capture3('identify', '-ping', '-format', '%w %h', source + '[0]')
          width, height = output.split.map(&:to_i)
          status.success? && width.to_i.positive? && height.to_i.positive? ? { 'width' => width, 'height' => height } : {}
        else
          {}
        end
      rescue Errno::ENOENT
        {}
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImageDimensions)
