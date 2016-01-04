class LiveController < WebsocketRails::BaseController

	def initialize_session
		controller_store[:map] = {}
		Map.all.each do |map|
			controller_store[map.name] = {:map_id => map.name, :world => JSON.load(map.world)}
		end
		#map_id = "map_void"
		#controller_store[map_id] = {:map_id => map_id, :world => {}} if controller_store[map_id].nil?
	end

    def client_connected
		WebsocketRails[:stream].trigger(:data, {:event => :client_connected}.to_json)
    end

	def client_disconnected
		WebsocketRails[:stream].trigger(:data, {:event => :client_disconnected}.to_json)
    end

	def new_map
		map_id = "map_" + rand(9999).to_s(36)
		map_id = message[:map_id]
		controller_store[map_id] = {:map_id => map_id, :world => {}} if controller_store[map_id].nil?
		puts "New map: #{map_id}"
		WebsocketRails[map_id].trigger(:map_update, controller_store[map_id].to_json)
	end

	def update_map
		unless message[:layer].nil?
			p message
			map_id = message[:map_id]
			layer = message[:layer].to_i
			p controller_store[map_id]
			controller_store[map_id][:world][layer] = {} if controller_store[map_id][:world][layer].nil?
			controller_store[map_id][:world][layer][message[:id].to_i] = message[:brush].to_i
		end
		WebsocketRails[map_id].trigger(:map_update, controller_store[map_id].to_json)
		save_map(map_id)
	end

	def delete_tile
		unless message[:tile_id].nil?
			map_id = message[:map_id]
			tile_id = message[:tile_id]
			controller_store[map_id][:world].each_key do |layer|
				puts "Deleting #{layer} -> #{tile_id}"

				controller_store[map_id][:world][layer][tile_id] = nil;
				#p controller_store[map_id][:world][layer-1].delete(tile_id)
			end
		end
		puts "Deleting tile #{message[:tile_id]}"
		WebsocketRails[map_id].trigger(:map_update, controller_store[map_id].to_json)
	end

	def stream

	end

	private
	def save_map(map_id)
		if Map.where(:name => map_id).blank?
			puts "No such map exists - insert"
			Map.create(:name => map_id, :world => controller_store[map_id][:world].to_json)
		else
			puts "Updating map"
			Map.find_by(:name => map_id).update(:world => controller_store[map_id][:world].to_json)

		end
	end

end
